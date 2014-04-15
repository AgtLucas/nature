'use strict';

(function () {

  var socket = io.connect('http://insta-nature.herokuapp.com');

  /**
   * Namespace
   */
  var Insta = Insta || {};

  Insta.App = {

    /**
     * Application initialization method / call for the methods being initialized in order
     */
    init: function () {
      this.getData();
    },

    /**
     * Get data Ajax and send to render method
     */
    getData: function () {
      var self = this;
      socket.on('show', function (data) {
        var url = data.show;
        $.ajax({
          url: url,
          type: 'POST',
          crossDomain: true,
          dataType: 'jsonp'
        }).done(function () {
          self.renderTemplate(data);
        });
      });
    }

  }

})(this);