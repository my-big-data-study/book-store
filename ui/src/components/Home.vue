<template>
  <div class="row">
    <div class="col-xs-7">
        <h1>BOOK LIST</h1>
        <div class="box book" v-for="book in books" v-bind:key="book.title">
          <div class="row">
            <div class="col-xs-9">
              <div class="book-title">{{book.title}}</div>
            </div>
            <div class="col-xs-3">
              <div class="book-quantity">
                <input v-model="book.quantity" type="number" required>
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="row">
            <div class="col-xs-9">
              <div class="order-delay-label">Order Delay (seconds)</div>
            </div>
            <div class="col-xs-3">
              <div class="order-delay">
                <input v-model="delay" type="number" required>
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
      delay: 0,
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
        items,
        delay: this.delay
      }
      axios.post("/api/orders", payload)
      .then(response => {
        const order = response.data.order;

        this.orders.push({
          id: order.id,
          timestamp: order.timestamp,
          items: items
        })
      })
    }
  }
}
</script>

<style scoped>
  .actions {
    text-align: right;
  }
  .book-title {
    text-align: left;
  }
  .book-quantity, .order-delay {
    text-align: right
  }
  .book {
    margin: 15px 0;
  }
  .order-delay-label {
    text-align: right;
    color: #AAA
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
