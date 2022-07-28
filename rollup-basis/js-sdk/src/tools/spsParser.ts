//https://blog.csdn.net/lizhijian21/article/details/80982403

export const ceil = (val) => {
	return Math.ceil(val);
}

// 获取buf 的前n个bit组成的值
export const u = (bitCount, input) => {
	let ret = 0;
	for( let i = 0;i< bitCount;i++) {
		ret <<= 1;
		if (input.data[Math.floor(input.index / 8)] & (0x80 >> (input.index % 8))) {
			ret += 1;
		}
		input.index++;
	}
	return ret;
}

/*无符号指数哥伦布编码(UE)
*哥伦布编码的码字code_word由三部分组成：code_word = [M个0] + [1] + [Info]
*其中，Info是一个携带信息的M位数据，每个哥伦布码的长度为（2M+1）位，每个码字都可由code_num产生。
*根据码字code_word解码出code_num值的过程如下：
*1. 首先读入M位以"1"为结尾的0；
*2. 根据得到的M，读入接下来的M位Info数据；
*3. 根据这个公式得到计算结果code_num = Info – 1 + 2M
*/
export const ue = (input, len) => {
	let zeroNum = 0;
	while(input.index < len * 8) {
		// 遇到1则停止，统计0的个数
		if(input.data[Math.floor(input.index/8)] & (0x80 >> (input.index %8))) {
			break;
		}
		zeroNum++;
		input.index++;
	}
	input.index++;

	let ret = 0;
	// 计算
	for(let i = 0; i < zeroNum; i++) {
		ret <<= 1;
		if(input.data[Math.floor(input.index/8)] & (0x80 >> input.index %8)) {
			ret += 1;
		}
		input.index++;
	}
	return (1<< zeroNum) - 1 + ret;
}

// 有符号哥伦布编码
export const se = (input, len) => {
	let ueVal = ue(input, len);
	let k = ueVal;
	let nValue = ceil(k / 2);
	
	if(ueVal %2 == 0) nValue = -nValue;
	return nValue;
}

export const spsParser = (buf) => {
	let startBitIndex = 0;

	// 去除00 00 00 01竞争码
	buf = buf.slice(4);
	let len = buf.length;
	
	// 输入参数
	let input = {	
		data: buf,
		index: startBitIndex
	};

	let forbidden_zero_bit = u(1, input);
	let nal_ref_idc = u(2, input);
	let nal_unit_type = u(5, input);
	let chroma_format_idc;
	
	if(nal_unit_type == 7) {
		let profile_idc = u(8, input);
		let constraint_set0_flag = u(1, input);
		let constraint_set1_flag = u(1, input);
		let constraint_set2_flag = u(1, input);
		let constraint_set3_flag = u(1, input);	
		let constraint_set4_flag = u(1, input);
		let constraint_set5_flag = u(1, input);
		
		let reserved_zero_2bits = u(2, input);
		let level_idc = u(8, input);
		let seq_parameter_set_id = ue(input, len);
		
		if(profile_idc == 100 || profile_idc == 110 || profile_idc == 122 || profile_idc == 144 ) {				
			chroma_format_idc = ue(input, len);
			if(chroma_format_idc == 3){
				let residual_colour_transform_flag = u(1, input);
			}

			let bit_depth_luma_minus8 = ue(input, len);
			let bit_depth_chroma_minus8 = ue(input, len);
			let qpprime_y_zero_transform_bypass_flag = u(1, input);
			let seq_scaling_matrix_present_flag = u(1, input);
			
			let seq_scaling_list_present_flag = new Uint8Array(8);
			if (seq_scaling_matrix_present_flag) {
				for (let i = 0; i < 8; i++) {
					seq_scaling_list_present_flag[i] = u(1, input);
				}
			}				
		}
		
		let log2_max_frame_num_minus4 = ue(input, len);
		let pic_order_cnt_type = ue(input, len);
		
		if (pic_order_cnt_type == 0) {
			// log2_max_pic_order_cnt_lsb_minus4 = ue(input, len);
		} else if (pic_order_cnt_type == 1) {
			let delta_pic_order_always_zero_flag = u(1, input);
			let offset_for_non_ref_pic = se(input, len);
			let offset_for_top_to_bottom_field = se(input, len);
			let num_ref_frames_in_pic_order_cnt_cycle = ue(input, len);

			let offset_for_ref_frame = new Uint8Array[num_ref_frames_in_pic_order_cnt_cycle];
			
			for (let j = 0; j < num_ref_frames_in_pic_order_cnt_cycle; j++) {
				offset_for_ref_frame[j] = se(input, len);
			}
		}
		
		let num_ref_frames = ue(input, len);
		let gaps_in_frame_num_value_allowed_flag = u(1, input);
		let pic_width_in_mbs_minus1 = ue(input, len);
		let pic_height_in_map_units_minus1 = ue(input, len);

		let width = (pic_width_in_mbs_minus1 + 1) * 16;//可能还要进行裁剪处理
		let height = (pic_height_in_map_units_minus1 + 1) * 16;
		
		let frame_mbs_only_flag = u(1, input);
		
		if (!frame_mbs_only_flag) {
			u(1, input);
		}
		
		let direct_8x8_inference_flag = u(1, input);
		let frame_cropping_flag = u(1, input);
		
		if (frame_cropping_flag) {
			let frame_crop_left_offset = ue(input, len);
            let frame_crop_right_offset = ue(input, len);
            let frame_crop_top_offset = ue(input, len);
            let frame_crop_bottom_offset = ue(input, len);
			
			let crop_unit_x = 1;
            let crop_unit_y = 2 - frame_mbs_only_flag;
			
            if (chroma_format_idc == 1) {   // 4:2:0
                crop_unit_x = 2;
                crop_unit_y = 2 * (2 - frame_mbs_only_flag);
            }
            else if (chroma_format_idc == 2) {    // 4:2:2
                crop_unit_x = 2;
                crop_unit_y = 2 - frame_mbs_only_flag;
            }
			
			width -= crop_unit_x * (frame_crop_left_offset + frame_crop_right_offset);
            height -= crop_unit_y * (frame_crop_top_offset + frame_crop_bottom_offset);
		}
		
		return {
			width:width,
			height:height
		}
	}
}


