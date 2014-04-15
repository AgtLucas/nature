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
    },

    /**
     * Render the images on the page and check for layout resize
     */
    renderTemplate: function () {
      var lastAnimate,
        lastSrc,
        nextSrc,
        last,
        current = data.data[0].images.standard_resolution.url,
        w = $(document).width(),
        query = data,
        source = $('.most-recent-tpl').html(),
        compiledTemplate = Handlebars.complete(source),
        result = compiledTemplate(query),
        imgWrap = $('.img-content');

      imgWrap.prepend(default);

      last = $('.img-content a:first-child');
      lastSrc = $('.img-content a:first-child').find('img').attr('src');
      nextSrc = $('.img-content a:nth-child(2)').find('img').attr('src');

    },

  }

})(this);