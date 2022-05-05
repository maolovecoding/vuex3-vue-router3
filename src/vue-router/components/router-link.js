export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "a",
    },
  },
  methods: {
    handler() {
      // 点击 就跳转到to对应的路径
      this.$router.push(this.to);
    },
  },
  render() {
    const tag = this.tag;
    return <tag onClick={this.handler}>{this.$slots.default}</tag>;
  },
};
