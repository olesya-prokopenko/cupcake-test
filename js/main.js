window.onload = function () {
  var catalog = 'catalog.json';
  var countScroll = 0;

  Vue.component('count', {
    template: '<div><select v-model.number="selected" @change="updateValue" class="browser-default">' +
                '<option disabled value="">Выберите количество</option>' +
                '<option>1</option>' +
                '<option>2</option>' +
                '<option>3</option>' +
                '<option>4</option>' +
                '<option>5</option>' +
                '<option>6</option>' +
                '<option>7</option>' +
                '</select>' +
              '</div>',
    data: function () {
      return {
        selected: ''
      }
    },
    methods: {
      updateValue: function () {
        this.$emit('updateValue', this.selected );
      }
    }
  });

  Vue.component('my-card', {
    template: '<div><div class="card sticky-action">' +
                '<div class="card-image waves-effect waves-block waves-light">' +
                  '<img class="activator" :src="url">' +
                  '<span class="card-title activator white-text text-darken-4">{{ title }}</span>' +
                '</div>' +
                '<div class="card-action center-align">' +
                  '<count @updateValue="setValue"></count>' +
                  '<a class="waves-effect waves-light btn" @click="increment">В корзину</a>' +
                '</div>' +
                '<div class="card-reveal">' +
                  '<div class="card-title grey-text text-darken-4"><span>{{ title }}</span>' +
                  '<i class="material-icons right">close</i></div>' +
                  '<p>Here is some more information about this product that is only revealed once clicked on.</p>' +
                '</div>' +
              '</div></div>',
    props: ['title', 'url', 'index'],
    data: function () {
      return {
        count: 0
      }
    },
    methods: {
      setValue: function (value) {
        this.count = value;
      },
      increment: function () {
        this.$emit('increment', this.count, this.index );
      }
    }
  });

  new Vue({
    el: '#app',
    data: {
      total: localStorage.total ? +localStorage.total : 0,
      items: null,
      busy: false,
      data: [],
      cartItems: localStorage.cartItems ? JSON.parse(localStorage.cartItems) : [],
      cartCounts: localStorage.cartCounts ? JSON.parse(localStorage.cartCounts) : []
    },
    created: function () {
      this.fetchData();
    },
    methods: {
      fetchData: function () {
        var self = this;
        $.get( catalog, function( data ) {
          self.items = data;
        });
      },
      loadMore: function() {
        var self = this;
        self.busy = true;
        setTimeout(function () {
          for (var i = 0, j = 12; ((i < j) && (countScroll < self.items.length)); i++) {
            self.data.push(self.items[countScroll++]);
          }
          self.busy = false;
        }, 1000);
      },
      incrementTotal: function (count, ind) {
        var self = this;
        if (count > 0) {
          var existingItem = $.inArray( self.data[ind], self.cartItems);
          self.total = self.total + count;
          localStorage.total = self.total;

          if (existingItem >= 0) {
            self.cartCounts[existingItem] = self.cartCounts[existingItem] + count;

            localStorage.cartCounts = JSON.stringify(self.cartCounts);
          }
          else {
            self.cartItems.push(self.data[ind]);
            self.cartCounts.push(count);

            localStorage.cartItems = JSON.stringify(self.cartItems);
            localStorage.cartCounts = JSON.stringify(self.cartCounts);
          }
        }
      },
      deleteItem: function (index) {
        var self = this;
        self.total = self.total - self.cartCounts[index];
        self.cartCounts.splice(index, 1);
        self.cartItems.splice(index, 1);

        localStorage.total = self.total;
        localStorage.cartItems = JSON.stringify(self.cartItems);
        localStorage.cartCounts = JSON.stringify(self.cartCounts);
      }
    }
  });

  $(".dropdown-button").dropdown({
    constrainWidth: false,
    belowOrigin: true
  });
  $(".button-collapse").sideNav();
};
