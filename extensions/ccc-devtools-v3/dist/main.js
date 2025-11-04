"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const electron_1 = require("electron");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const TAG = '[ccc-devtools]';
const homePageUrl = 'https://github.com/potato47/ccc-devtools';
const originUrl = 'https://github.com/potato47/ccc-devtools/raw/master/release/preview-template.zip';
const tempDownloadPath = path_1.default.join(__dirname, '../release/temp.zip');
const localTemplateSavePath = path_1.default.join(__dirname, '../release/');
const localTemplatePath = path_1.default.join(localTemplateSavePath, 'preview-template');
const projectTemplatePath = path_1.default.join(Editor.Project.path, 'preview-template');
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    generateTemplate() {
        if (!fs_extra_1.default.existsSync(localTemplatePath)) {
            Editor.Task.addNotice({ title: 'ccc-devtools', message: '本地版本丢失', type: 'error' });
            return;
        }
        fs_extra_1.default.copy(localTemplatePath, projectTemplatePath).then(() => {
            console.log(TAG, '创建预览模板成功');
            Editor.Task.addNotice({ title: 'ccc-devtools', message: '创建预览模板成功', type: 'success', timeout: 2000 });
        }).catch(err => {
            console.error(TAG, '创建预览模板失败', err);
            Editor.Task.addNotice({ title: 'ccc-devtools', message: '创建预览模板失败', type: 'error' });
        });
    },
    replaceLocal() {
        electron_1.shell.showItemInFolder(path_1.default.join(__dirname, '../release/preview-template'));
    },
    // async updateVersion() {
    //     Editor.Task.addNotice({ title: 'ccc-devtools', message: '正在下载最新版本', type: 'log' });
    //     fsc.writeFileSync(tempDownloadPath, await download(originUrl));
    //     Editor.Task.addNotice({ title: 'ccc-devtools', message: '正在解压', type: 'log' });
    //     fsc.removeSync(localTemplatePath);
    //     const zip = new AdmZip(tempDownloadPath);
    //     zip.extractAllTo(localTemplateSavePath, true);
    //     fsc.removeSync(tempDownloadPath);
    //     Editor.Task.addNotice({ title: 'ccc-devtools', message: '更新完成', type: 'success' });
    // },
    removeTemplate() {
        fs_extra_1.default.remove(projectTemplatePath).then(() => {
            console.log(TAG, '删除预览模板成功');
            Editor.Task.addNotice({ title: 'ccc-devtools', message: '删除预览模板成功', type: 'success', timeout: 2000 });
        }).catch(err => {
            console.error(TAG, err);
            Editor.Task.addNotice({ title: 'ccc-devtools', message: '删除预览模板失败', type: 'error' });
        });
    },
    jumpToHomepage() {
        electron_1.shell.openExternal(homePageUrl);
    },
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() { }
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
