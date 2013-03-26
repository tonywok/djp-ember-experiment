window.App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

// Router
//
App.Router.map(function() {
  this.resource("parts", function() {
    this.route("new");
    this.resource("part", { path: "/:part_id" }, function() {
      this.resource("version", { path: "/:version_id" });
    });
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('parts.new');
  }
});

// Part Collection Routes
//
App.PartsRoute = Ember.Route.extend({
  model: function() {
    return [App.Part.create({name: "Verse 1", body: "lorem" })];
  }
});

  App.PartsIndexRoute = Ember.Route.extend({
    redirect: function() {
      this.transitionTo('parts.new');
    }
  })

  App.PartsNewRoute = Ember.Route.extend({
    model: function() {
      return App.Part.create();
    },
    renderTemplate: function() {
      this.render("parts.new", { outlet: "parts", into: "parts" });
    }
  });

// Part Member Routes

App.PartRoute = Ember.Route.extend({
  model: function(params) {
    var part = this.controllerFor('parts').get('content').find(function(part) {
      return part.get("name") === params.part_id;
    });

    if (!part) this.transitionTo("parts.new");
    return part;
  }
});

  App.PartIndexRoute = Ember.Route.extend({
    renderTemplate: function() {
      this.render("part", { outlet: "parts", into: "parts" });
    }
  });

// Version Member Routes

App.VersionRoute = Ember.Route.extend({
  model: function(params) {
    var part = this.modelFor("part");

    var version = part.get('versions').find(function(v) {
      return v.get("id") === params.version_id;
    });
    if (!version) this.transitionTo("part", part);
    return version;
  },

  renderTemplate: function() {
    this.render("version", { outlet: "parts", into: "parts" });
  }
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

//Models
//
App.Version = Ember.Object.extend({
  id: function() {
    return this.get("part.name");
  }.property("part.name"),
});

App.Part = Ember.Object.extend({
  id: function() {
    return this.get("name");
  }.property("name"),

  versions: [
    App.Version.create({id: "1", body: "bar"}),
    App.Version.create({id: "2", body: "bar"}),
    App.Version.create({id: "3", body: "bar"})
  ]
});
