<template>
    <tz-config-provider
        :upload="config"
        :locale="locale"
        :v-permission="vPermission"
    >
        <router-view />
    </tz-config-provider>
</template>
<script>
import { defineComponent } from 'vue'
import { useResize, vPermission, useTzRoute } from './vhooks'
import { zhCn } from 'tz-ui'
import { useUserStore } from './store/modules/user'
import { usePermissionStore } from './store/modules/permission'
import { usePostMessageStore } from './store/modules/postMessage'
import { setFrontWebHost, setTabsMenuId } from './utils/storage'
import { isIframeApp } from './utils'
export default defineComponent({
    name: 'App',
    setup() {
        useResize();
        const { eventChannel } = useTzRoute();
        const config = {
            baseUrl: '',
        };
        // 嵌在旧系统iframe中
        if (isIframeApp) {
            eventChannel.emit('getInitData', [], function(res) {
                console.log('iframe获取数据成功', res)
                useUserStore().setInfo(JSON.parse(res.userInfo));

                // 兼容外网Create与内容Add的按钮权限
                const btns = res.buttonJurisdiction.replace(/("Create")+/g, '$1,"Add"');
                usePermissionStore().setRoles(JSON.parse(btns));
                setFrontWebHost(JSON.parse(res.frontWebHost));
                setTabsMenuId(res.menuIdObj);
            });
            window.addEventListener('message', function(e) {
                const { data } = e;
                if (typeof data === 'string' && data.indexOf(':') > -1) {
                    const dataArr = data.split(':');
                    const msgData = {
                        path: dataArr[0],
                        event: {
                            type: dataArr[1],
                            data: {},
                        },
                    };
                    usePostMessageStore().setEventChannelMsg(msgData);
                } else {
                    usePostMessageStore().setEventChannelMsg(data);
                }
            });
        }
        return {
            vPermission,
            config,
            locale: zhCn
        }
    }
})
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
