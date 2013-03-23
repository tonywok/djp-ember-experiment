window.App = Ember.Application.create();

// Router
//
App.Router.map(function() {
  this.resource('songs', function() {
    this.route('edit', { path: "/:name/edit" });
    this.route('new');
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('songs.new');
  }
});

App.SongsEditRoute = Ember.Route.extend({
  setupController: function(controller, name) {
    var song = this.controllerFor('sidebar').get('content').find(function(item) {
      return item.get("name") === name;
    });
    this.controller.set('content', song);
  }
});

App.SongsNewRoute = Ember.Route.extend({
  model: function() {
    return App.Song.create({name: "", body: ""});
  },
  setupController: function() {
    this.controller.set("content", App.Song.create({name: "", body: ""}));
  }
});

//Models
//
App.Song = Ember.Object.extend({
});

//Controllers
//
App.SidebarController = Ember.ArrayController.extend({
});

App.SongsController = Ember.Controller.extend({
});

App.SongsEditController = Ember.ObjectController.extend({
  needs: ["songs"],

  save: function() {
  }
});

App.SongsNewController = Ember.ObjectController.extend({
  needs: ["songs", "sidebar"],

  save: function() {
    this.get("controllers.sidebar").pushObject(this.get("content"));
  }
});

