<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="symbolId" />
    </svg>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'SvgIcon',
    props: {
        prefix: {
            type: String,
            default: 'tz-icon'
        },
        className: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const symbolId = computed(() => `#${props.prefix}-${props.name}`);
        const svgClass = computed(() => {
            if (props.className) {
                return `svg-icon ${props.className}`
            }
            return 'svg-icon'
        });
        return { symbolId, svgClass }
    }
})
</script>
<style lang="scss" scoped>
    .svg-icon {
        width: 1em;
        // todo
    }
</style>
