
export default {
    data () {
        return {
            a: 1,
            b: 2,
            c: 3,
        }
    },
    computed: {
        // xx
    },
    mounted() {
        // xx
    },
    methods: {
        showA()  {
            console.log(this.a)
            alert('aaaa' + this.a)
        },
        showC() {
            alert('common aaaa')
        }
    },
    destroyed () {
        // xx
    },
}