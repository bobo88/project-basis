import fs from 'fs';
// import * as url from 'node_modulesx/url/url';
import * as path from 'path';
const dirPath = path.resolve(`${__dirname}`, '../libs/');
// console.log(5555, path, fs)

//#region 
// const temp: string[] = [];
// function fileDisplay(filePath: string) {
//   console.log(fs.readdir)
//   // 根据文件路径读取文件，返回一个文件列表
//   // fs.readdir(filePath, (err, files) => {
//   //   if (err) {
//   //     console.warn(err);
//   //     return;
//   //   }
//   //   // 遍历读取到的文件列表
//   //   files.forEach(filename => {
//   //     // path.join得到当前文件的绝对路径
//   //     const filepath = path.join(filePath, filename);
//   //     // 根据文件路径获取文件信息
//   //     fs.stat(filepath, (error, stats) => {
//   //       if (error) {
//   //         console.warn('获取文件stats失败');
//   //         return;
//   //       }
//   //       const isFile = stats.isFile(); // 是否为文件
//   //       const isDir = stats.isDirectory(); // 是否为文件夹
//   //       if (isFile) {
//   //         console.log(filepath); //如果是文件，输出它的路径咯～
//   //       }
//   //       if (isDir) {
//   //         fileDisplay(filepath); // 递归，如果是文件夹，就继续遍历该文件夹里面的文件；
//   //       }
//   //     });
//   //   });
//   // });
// }
// fileDisplay(dirPath)
//#endregion

interface MenuType {
  key: string,
  langKey?: string,
  title: string,
  code?: string,
  path: string,
  icon?: string,
  child?: MenuType[]
}

const menus: MenuType[] = [
  {
    key: "Home",
    title: "主页",
    path: "/"
  },
  {
    key: "About",
    title: "联系Test",
    path: "/about"
  },
  // {
  //   key: "VueMicroApp",
  //   title: "Vue 主页",
  //   path: "/vue"
  // },
  // {
  //   key: "VueMicroAppList",
  //   title: "Vue 列表页",
  //   path: "/vue/list"
  // },
  // {
  //   key: "VueMicroAppAbout",
  //   title: "Vue about页面",
  //   path: "/vue/about"
  // },
  // {
  //   key: "ReactMicroApp",
  //   title: "React 主页",
  //   path: "/react"
  // },
  // {
  //   key: "ReactMicroAppList",
  //   title: "React 列表页",
  //   path: "/react/list"
  // },
  // {
  //   key: "StaticMicroApp",
  //   title: "Static 微应用",
  //   path: "/static"
  // },
  // {
  //   langKey: 'home',
  //   code: 'SECOND_MENU_USER_LIST',
  //   path: '/home',
  //   icon: 'icon-tuijian',
  // }
]
export default menus;
