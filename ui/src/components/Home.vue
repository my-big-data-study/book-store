<template>
  <div class="row">
    <div class="col-xs-7">
        <h1>BOOK LIST</h1>
        <div class="box book" v-for="book in books" v-bind:key="book.title">
          <div class="row">
            <div class="col-xs-9">
              <div class="boot-title">{{book.title}}</div>
            </div>
            <div class="col-xs-3">
              <div class="book-quantity">
                <input v-model="book.quantity" type="number" required>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button v-on:click="createOrder">Create</button>
        </div>
    </div>

     <div class="col-xs-5">
       <h2>Orders</h2>
       <div class="order box" v-for="order in orders" v-bind:key="order.id">
          <h3 class="order-title">{{order.id}}</h3>
          <div class="row item" v-for="item in order.items" v-bind:key="item.title">
            <div class="col-xs-8"><div class="item-title">{{item.title}}</div></div>
            <div class="col-xs-4"><div class="item-quantity">{{item.quantity}}</div></div>
          </div>
          <div class="order-timestamp">
            {{order.timestamp}}
          </div>
       </div>
     </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      books: [],
      orders: [],
      selectedBook: null
    }
  },

  created() {
    axios.get("/api/books")
    .then(response => {
      this.books = response.data.map(book => {
        return {
          title: book.title,
          quantity: 0
        }
      })
    })
  },
  methods: {
    createOrder(event) {
      const items = this.books.map(book => {
        return {
          title: book.title,
          quantity: parseInt(book.quantity)
        }
      }).filter(book => book.quantity)

      if (items.length === 0) {
        return
      }
      const payload = {
        items
      }
      axios.post("/api/orders", payload)
      .then(response => {
        const order = response.data.order;

        this.orders.push({
          id: order.id,
          timestamp: order.timestamp,
          items: items
        })

        console.log(this.orders);
      })
    }
  }
}
</script>

<style scoped>
  .actions {
    text-align: right;
  }
  .book-quantity {
    text-align: right
  }
  .book {
    margin: 10px 0;
  }
  .item {
    margin-bottom: 5px;
  }
  .order-timestamp {
    text-align: right;
  }
  .order-title {
    text-align: right;
  }
  .item-quantity {
    text-align: right;
  }
</style>
