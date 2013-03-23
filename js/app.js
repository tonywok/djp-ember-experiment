window.App = Ember.Application.create();

// Router
//
App.Router.map(function() {
  this.resource("parts", function() {
    this.route("new");
    this.resource('part', { path: ':part_id' });
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('parts.new');
  }
});

App.PartsRoute = Ember.Route.extend({
  model: function() {
    return [
      App.Part.create({name: "Verse 1", body: "lorem" })
    ];
  }
});

App.PartsNewRoute = Ember.Route.extend({
  model: function() {
    return App.Part.create()
  }
});

App.PartRoute = Ember.Route.extend({
  model: function(params) {
    var part = this.controllerFor('parts').get('content').find(function(part) {
      return part.get("name") === params.part_id;
    });

    if (!part) {
      this.transitionTo("parts.new");
    }

    return part;
  }
});

//Models
//
App.Part = Ember.Object.extend({
  id: function() {
    return this.get("name");
  }.property("name")
});

//Controllers
//
App.PartsNewController = Ember.ObjectController.extend({
  needs: ["parts"],

  create: function() {
    var part = this.get("content");
    this.get("controllers.parts").pushObject(part);
    this.transitionToRoute("part", part);
  }
});

