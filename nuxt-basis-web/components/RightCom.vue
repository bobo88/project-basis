<template>
  <div class="right-box">
    <!-- <div class="item user" @click="applyForTrial">
      <p><span>申请试用</span></p>
    </div>
    <div class="item phone">
      <p><span>客服热线：400-6686289</span></p>
    </div>

    <div class="dialog-custom">
      <el-dialog  title="申请试用" v-model="dialogFormVisible" width="360px" top="25vh" @close="closeDialog">
        <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm">
          <el-form-item label="" prop="company">
            <p class="title">公司：</p>
            <el-input v-model="ruleForm.company" autocomplete="off" />
          </el-form-item>
          <el-form-item label="" prop="username">
            <p class="title">您的称呼：</p>
            <el-input v-model="ruleForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="" prop="phone">
            <p class="title">电话：</p>
            <el-input v-model.trim="ruleForm.phone" :maxlength="11" autocomplete="off" @input="changePhone" />
          </el-form-item>
          <el-form-item label="" prop="verification_code">
            <p class="title">验证码：</p>
            <div>
              <span class="inline-block" style="margin-right:2%; width: 48%; vertical-align: middle;">
                <el-input v-model.number="ruleForm.verification_code" autocomplete="off" />
              </span>
              <el-button v-if="!isSend" :type="!phoneOK ? 'info' : 'primary'" @click="getVerificationCode" :disabled="!phoneOK" style="width: 50%; vertical-align: middle;">点击获取验证码</el-button>
              <el-button v-else type="info" disabled style="width: 50%; vertical-align: middle;">{{ endTime }}秒后再次获取</el-button>
            </div>
          </el-form-item>

        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="submitForm(ruleFormRef)" style="width:100%">提交</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <el-dialog  title="" v-model="dialogVisible" width="360px" :show-close="false" top="35vh" center @close="dialogVisible = false">
      <p class="tc mb10">
        <img src="@/assets/images/icon_get.png" width="52" height="52" alt="OK">
      </p>
      <p class="tc f14">感谢您的申请，请等待工作人员与您联系。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false" style="width:100%">确定</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script>
  // import { reactive, ref } from 'vue'
  // import type { FormInstance, FormRules } from 'element-plus'
  // import { ElMessage } from 'element-plus'
  // // import { sendApplyTrialSms, tenantPurchaseInstance } from '@u/api'

  // const dialogFormVisible = ref(false);
  // const dialogVisible = ref(false);
  // const ruleForm = reactive({
  //   company: '',
  //   username: '',
  //   phone: '',
  //   verification_code: '',
  // });
  // const ruleFormRef  = ref<FormInstance>();

  // const validatePhone = (rule: any, value: any, callback: any) => {
  //   const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  //   if (value === '') {
  //     callback(new Error('请输入您的电话'))
  //   } else if (!reg.test(value)) {
  //     callback(new Error("您输入的手机号不正确，请重新输入"))
  //   } else {
  //     callback()
  //   }
  // };
  // const rules = reactive<FormRules>({
  //   company: [
  //     { required: true, message: '请输入公司的名称', trigger: 'blur' },
  //   ],
  //   username: [
  //     { required: true, message: '请输入您的称呼', trigger: 'blur' },
  //   ],
  //   phone: [
  //     { required: true, validator: validatePhone, trigger: 'blur' },
  //   ],
  //   // phone: [
  //   //   { required: true, message: '请输入您的电话', trigger: 'blur' },
  //   //   { type: 'number', message: '电话号码必须是数字' },
  //   // ],
  //   verification_code: [
  //     { required: true, message: '请输入验证码', trigger: 'blur' },
  //     { type: 'number', message: '验证码必须是数字' },
  //   ],
  // });

  // // 申请试用
  // const applyForTrial = () => {
  //   dialogFormVisible.value = true;
  //   console.log(588)
  // };

  // // 验证电话号码是否正确
  // const phoneOK = ref(false);
  // const changePhone = () => {
  //   const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  //   ruleForm.phone = ruleForm.phone.replace(/\D+/g, '');
  //   // console.log(588, ruleForm.phone)
  //   if (!reg.test(ruleForm.phone)) {
  //     console.log('手机号码不对')
  //     phoneOK.value = false;
  //   } else {
  //     phoneOK.value = true;
  //   }
  // };

  // const isSend = ref<boolean>(false);
  // const endTime = ref<number>(60);
  // // 获取验证码
  // const getVerificationCode = () => {
  //   // axios......
  //   // 发送试用申请短信
  //   sendApplyTrialSms({
  //     phoneNumber: ruleForm.phone
  //   }).then(res => {
  //     let resData = res.data;
  //     console.log(res)
  //     if (+resData.code !== 200) {
  //       ElMessage.error(resData.msg || 'Oops, sth error.')
  //     } else {
  //       console.log('喜大普奔，sendApplyTrialSms 接口联调OK了 ==', res)
  //       isSend.value = true;
  //       let tm = setInterval(() => {
  //         --endTime.value;
  //         if (endTime.value === 0) {
  //           clearInterval(tm);
  //           endTime.value = 60;
  //           isSend.value = false;
  //         }
  //       }, 1000)
  //     }
  //   }).catch(error => {
  //     let res = error.response.data
  //     ElMessage.error(res.msg || 'Oops, sth error.')
  //   })

  // }
  // // 提交
  // const submitForm = async (formEl: FormInstance | undefined) => {
  //   if (!formEl) return
  //   await formEl.validate((valid, fields) => {
  //     if (valid) {
  //       console.log('submit!')
  //       // 要判断验证码是否正确，OK才关闭并弹出后续联系弹窗
  //       // 发送试用申请短信
  //       tenantPurchaseInstance({
  //         "businessScenario": "",
  //         "companyName": ruleForm.company,
  //         "contactName": ruleForm.username,
  //         "contactNumber": ruleForm.phone,
  //         "mailbox": '',
  //         "verificationCode": ruleForm.verification_code
  //       }).then(res => {
  //         let resData = res.data;
  //         console.log(res)
  //         if (+resData.code !== 200) {
  //           ElMessage.error(resData.msg || 'Oops, sth error.')
  //         } else {
  //           console.log('喜大普奔，tenantPurchaseInstance 接口联调OK了 ==', res)
  //           dialogFormVisible.value = false;
  //           dialogVisible.value = true;
  //         }
  //       })
  //     } else {
  //       console.log('error submit!', fields)
  //     }
  //   })
  // };
  // const closeDialog = () => {
  //   resetForm(ruleFormRef.value)
  // };
  // const resetForm = (formEl: FormInstance | undefined) => {
  //   if (!formEl) return
  //   formEl.resetFields()
  // };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .right-box {
    position: fixed;
    z-index: 999;
    top: 50%;
    right: 50px;
    margin-top: -65px;
    padding: 24px 0;
    width: 60px;
    height: 130px;
    background: linear-gradient(180deg, #F1F3F7 0%, #FFFFFF 100%);
    box-shadow: 0px 0px 11px 1px rgba(211, 211, 211, 0.5);
    border-radius: 30px 30px 30px 30px;
    opacity: 1;
    border: 1px solid #FFFFFF;
    .item {
      position: relative;
      z-index: 99;
      display: block;
      padding: 0 17px;
      width: 58px;
      height: 40px;
      cursor: pointer;
      background-size: 24px 24px;
      p {
        position: absolute;
        z-index: 999;
        display: none;
        padding: 10px 0;
        color: #666;
        font-size: 14px;
        font-weight: 400;
        font-style: normal;
        text-align: center;
      }
      &:hover {
        p {
          display: block;
        }
      }
      &.user {
        position: relative;
        z-index: 999;
        padding-bottom: 16px;
        background: url('@/assets/images/icon_use.png') top center no-repeat;
        background-size: 24px 24px;
        &::after {
          position: absolute;
          z-index: 9;
          bottom: 0;
          left: 15px;
          content: ' ';
          display: block;
          width: 30px;
          height: 1px;
          background: #E5E7EA;
        }
        // border-bottom: 1px solid #E5E7EA;
        &:hover {
          background: url('@/assets/images/icon_use_hover.png') top center no-repeat;
          background-size: 24px 24px;
        }
        p {
          top: -15px;
          left: -86px;
          width: 90px;
          height: 40px;
          span {
            display: block;
            width: 80px;
            height: 40px;
            line-height: 40px;
            background: #FFFFFF;
            border-radius: 8px;
          }
        }
      }
      &.phone {
        padding-top: 16px;
        background: url('@/assets/images/icon_phone.png') bottom center no-repeat;
        background-size: 24px 24px;
        &:hover {
          background: url('@/assets/images/icon_phone_hover.png') bottom center no-repeat;
          background-size: 24px 24px;
        }
        p {
          top: 0;
          left: -196px;
          width: 200px;
          height: 40px;
          span {
            display: block;
            width: 190px;
            height: 40px;
            line-height: 40px;
            background: #FFFFFF;
            border-radius: 8px;
          }
        }
      }
    }
  }
</style>
