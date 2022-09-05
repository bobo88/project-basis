
export default {
    data () {
        return {
            a: 2,
            b: 3,
            c: 4,
        }
    },
    computed: {
        // xx
    },
    mounted() {
        // xx
    },
    methods: {
        showB () {
            console.log(this.a)
            alert('bbbb' + this.a)
        },
        showC () {
            alert('common bbb')
        }
    },
    destroyed () {
        // xx
    },
}