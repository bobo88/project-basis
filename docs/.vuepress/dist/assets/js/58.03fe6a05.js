(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{349:function(s,n,t){"use strict";t.r(n);var a=t(13),e=Object(a.a)({},(function(){var s=this,n=s._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/**\n     * 141. 环形链表\n     * 给你一个链表的头节点 head ，判断链表中是否有环。\n     * 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，\n     * 评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。\n     * 注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。\n     * \n     * 如果链表中存在环 ，则返回 true 。 否则，返回 false 。\n     * \n     * 输入：head = [3,2,0,-4], pos = 1\n     * 输出：true\n     * 解释：链表中有一个环，其尾部连接到第二个节点。\n     * \n     * 输入：head = [1,2], pos = 0\n     * 输出：true\n     * 解释：链表中有一个环，其尾部连接到第一个节点。\n     * \n     * 输入：head = [1], pos = -1\n     * 输出：false\n     * 解释：链表中没有环。\n     * \n     * 进阶：你能用 O(1)（即，常量）内存解决此问题吗？\n     * \n     */")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/**\n     * Definition for singly-linked list.\n     * class ListNode {\n     *     val: number\n     *     next: ListNode | null\n     *     constructor(val?: number, next?: ListNode | null) {\n     *         this.val = (val===undefined ? 0 : val)\n     *         this.next = (next===undefined ? null : next)\n     *     }\n     * }\n     */")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ListNode")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("val")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" number\n        "),n("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("next")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" ListNode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("constructor")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("val"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" number"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" next"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" ListNode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")])]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n            "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("this")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("val "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("val"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("undefined")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" val"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n            "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("this")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("next "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("next"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("===")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("undefined")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("?")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" next"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("hasCycle")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token parameter"}},[n("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("head")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" ListNode "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")])]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" boolean "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 方法一： 官方 -> 哈希表")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let map = new Map();")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// while (head) {")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     if (map.has(head)) return true; // 如果当前节点在map中存在就说明有环")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     map.set(head, true); // 否则就加入map")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     head = head.next; // 迭代节点")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// }")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// return false; // 循环完成发现没有重复节点，说明没环")]),s._v("\n\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 方法二： 官方 -> 快慢指针")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 设置快慢指针")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let slow = head;")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let fast = head;")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// // 如果没有环，则快指针会抵达终点，否则继续移动双指针")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// while (slow && fast && fast.next) {")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     slow = slow.next;")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     fast = fast.next.next;")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     // 快慢指针相遇，说明含有环")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     if (slow == fast) {")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//         return true;")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     }")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// }")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// return false;")]),s._v("\n\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 方法三： DIY")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// ?????")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),s._v("\n\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 方法四： 链表反转 - 再比较")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// todo")]),s._v("\n\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 其他： 天秀解法")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 1. JSON.stringify(head) 秒杀法： 除非不报错，报错就是有环！！")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// try {")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     JSON.stringify(head)")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// } catch{")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     return true")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// }")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// return false")]),s._v("\n\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 2. 鸡贼法: 题目说了范围不超过100000，没超过size能发现空节点就是没有环， 超过了就是有环！！！")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let i = 0, size = 100000")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// let node = head")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// while (++i <= size) {")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     if(!node) return false")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//     node = node.next")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// }")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// return true;")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br"),n("span",{staticClass:"line-number"},[s._v("35")]),n("br"),n("span",{staticClass:"line-number"},[s._v("36")]),n("br"),n("span",{staticClass:"line-number"},[s._v("37")]),n("br"),n("span",{staticClass:"line-number"},[s._v("38")]),n("br"),n("span",{staticClass:"line-number"},[s._v("39")]),n("br"),n("span",{staticClass:"line-number"},[s._v("40")]),n("br"),n("span",{staticClass:"line-number"},[s._v("41")]),n("br"),n("span",{staticClass:"line-number"},[s._v("42")]),n("br"),n("span",{staticClass:"line-number"},[s._v("43")]),n("br"),n("span",{staticClass:"line-number"},[s._v("44")]),n("br"),n("span",{staticClass:"line-number"},[s._v("45")]),n("br"),n("span",{staticClass:"line-number"},[s._v("46")]),n("br"),n("span",{staticClass:"line-number"},[s._v("47")]),n("br"),n("span",{staticClass:"line-number"},[s._v("48")]),n("br"),n("span",{staticClass:"line-number"},[s._v("49")]),n("br"),n("span",{staticClass:"line-number"},[s._v("50")]),n("br"),n("span",{staticClass:"line-number"},[s._v("51")]),n("br"),n("span",{staticClass:"line-number"},[s._v("52")]),n("br"),n("span",{staticClass:"line-number"},[s._v("53")]),n("br"),n("span",{staticClass:"line-number"},[s._v("54")]),n("br"),n("span",{staticClass:"line-number"},[s._v("55")]),n("br"),n("span",{staticClass:"line-number"},[s._v("56")]),n("br"),n("span",{staticClass:"line-number"},[s._v("57")]),n("br"),n("span",{staticClass:"line-number"},[s._v("58")]),n("br"),n("span",{staticClass:"line-number"},[s._v("59")]),n("br"),n("span",{staticClass:"line-number"},[s._v("60")]),n("br"),n("span",{staticClass:"line-number"},[s._v("61")]),n("br"),n("span",{staticClass:"line-number"},[s._v("62")]),n("br"),n("span",{staticClass:"line-number"},[s._v("63")]),n("br"),n("span",{staticClass:"line-number"},[s._v("64")]),n("br"),n("span",{staticClass:"line-number"},[s._v("65")]),n("br"),n("span",{staticClass:"line-number"},[s._v("66")]),n("br"),n("span",{staticClass:"line-number"},[s._v("67")]),n("br"),n("span",{staticClass:"line-number"},[s._v("68")]),n("br"),n("span",{staticClass:"line-number"},[s._v("69")]),n("br"),n("span",{staticClass:"line-number"},[s._v("70")]),n("br"),n("span",{staticClass:"line-number"},[s._v("71")]),n("br"),n("span",{staticClass:"line-number"},[s._v("72")]),n("br"),n("span",{staticClass:"line-number"},[s._v("73")]),n("br"),n("span",{staticClass:"line-number"},[s._v("74")]),n("br"),n("span",{staticClass:"line-number"},[s._v("75")]),n("br"),n("span",{staticClass:"line-number"},[s._v("76")]),n("br"),n("span",{staticClass:"line-number"},[s._v("77")]),n("br"),n("span",{staticClass:"line-number"},[s._v("78")]),n("br"),n("span",{staticClass:"line-number"},[s._v("79")]),n("br"),n("span",{staticClass:"line-number"},[s._v("80")]),n("br"),n("span",{staticClass:"line-number"},[s._v("81")]),n("br"),n("span",{staticClass:"line-number"},[s._v("82")]),n("br"),n("span",{staticClass:"line-number"},[s._v("83")]),n("br"),n("span",{staticClass:"line-number"},[s._v("84")]),n("br"),n("span",{staticClass:"line-number"},[s._v("85")]),n("br"),n("span",{staticClass:"line-number"},[s._v("86")]),n("br"),n("span",{staticClass:"line-number"},[s._v("87")]),n("br"),n("span",{staticClass:"line-number"},[s._v("88")]),n("br"),n("span",{staticClass:"line-number"},[s._v("89")]),n("br"),n("span",{staticClass:"line-number"},[s._v("90")]),n("br"),n("span",{staticClass:"line-number"},[s._v("91")]),n("br"),n("span",{staticClass:"line-number"},[s._v("92")]),n("br"),n("span",{staticClass:"line-number"},[s._v("93")]),n("br"),n("span",{staticClass:"line-number"},[s._v("94")]),n("br"),n("span",{staticClass:"line-number"},[s._v("95")]),n("br")])])])}),[],!1,null,null,null);n.default=e.exports}}]);