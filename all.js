const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
//定義規則
defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"),
});

const app = Vue.createApp({
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "yana",
      products: [],
      tempProduct: {},
      cart: {},
      isLoading: true,
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
    Loading: VueLoading.Component,
  },
  methods: {
    getProducts() {
      const url = `${this.url}/api/${this.path}/products`;
      axios
        .get(url)
        .then((response) => {
          this.isLoading = false;
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    viewProduct(id) {
      const url = `${this.url}/api/${this.path}/product/${id}`;
      //this.loadingStatus.loadingItem = id;
      axios
        .get(url)
        .then((res) => {
          //this.loadingStatus.loadingItem = '';
          this.tempProduct = res.data.product;
          this.$refs.productModal.openModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },//this.$refs.productModal.openModal();：這是通過 $refs 特性來調用模態對話框組件中的 openModal 方法。這個方法用於打開模態對話框，以顯示特定產品的詳細信息。
    addToCart(id, qty = 1) {
      const url = `${this.url}/api/${this.path}/cart`;
      //this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      this.$refs.productModal.hideModal();
      axios
        .post(url, { data: cart })
        .then((res) => {
          alert(res.data.message);
          //this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    changeNum(item) {
      //this.loadingStatus.loadingItem = data.id;
      const url = `${this.url}/api/${this.path}/cart/${item.id}`;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      axios
        .put(url, { data: cart })
        .then((res) => {
          alert(res.data.message);
          //this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
          //this.loadingStatus.loadingItem = '';
        });
    },
    getCart() {
      const url = `${this.url}/api/${this.path}/cart`;
      axios
        .get(url)
        .then((res) => {
          this.cart = res.data.data;
          console.log(this.cart);
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteProduct(id) {
      const url = `${this.url}/api/${this.path}/cart/${id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    emptyCart() {
      const url = `${this.url}/api/${this.path}/carts`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    sendOrder() {
      const url = `${this.url}/api/${this.path}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請輸入正確的電話號碼";
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.component("productModal", {
  props: ["product"],
  data() {
    return {
      modal: "",
      qty: "",
    };
  },
  template: "#productModal",
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});

app.mount("#app");
/****Vue 組件：

VForm、VField 和 ErrorMessage 組件來自 VeeValidate，用於表單驗證。
Loading 組件是一個用於顯示加載狀態的組件。
productModal 組件是自定義的模態框組件，用於顯示單個產品的詳細信息。這個組件有自己的打開和關閉模態框的方法。
Vue 應用程序的挂載點：

app.mount("#app") 將 Vue 應用程序挂載到 HTML 中的 #app 元素上。 */