
window.App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

// Router
//
App.Router.map(function() {
  this.resource("parts", function() {
    this.route("new");
    this.resource("part", { path: "/:part_id" }, function() {
      this.resource("version", { path: "/versions/:version_id" });
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
  },
  setupController: function(controller) {
    this.controllerFor("part_comments.new").set("content", App.Comment.create({
      body: "",
    }));
  }
});

  App.PartsIndexRoute = Ember.Route.extend({
    redirect: function() {
      this.transitionTo('parts.new');
    }
  });

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
  },
  setupController: function(controller) {
    this.controllerFor("version_comments.new").set("content", App.Comment.create({
      body: "",
    }));
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

App.PartController = Ember.ObjectController.extend({
  isSaved: true,
});

App.VersionController = Ember.ObjectController.extend({
  isSaved: true,
  revise: function() {
    this.set('isSaved', true);
  },
  saveState: function() {
    return ((this.get("isSaved")) ? "Saved" : "Save");
  }.property("isSaved"),
});

App.PartCommentsNewController = Ember.ObjectController.extend({
  isSaved: true,
  needs: ["part"],
  post: function(comment) {
    var partController = this.get("controllers.part");
    var part = partController.get("content");
    part.get("comments").pushObject(comment);
    this.set("content", App.Comment.create({ body: "" }));
  }
});

App.VersionCommentsNewController = Ember.ObjectController.extend({
  isSaved: true,
  needs: ["version"],
  post: function(comment) {
    var versionController = this.get("controllers.version");
    var version = versionController.get("content");
    version.get("comments").pushObject(comment);
    this.set("content", App.Comment.create({ body: "" }));
  }
});

App.LineController = Ember.ObjectController.extend({
  showingNewNote: false,
  isSaved: true,
  note: "",

  showingNotes: function() {
   return this.get("showingNewNote") || this.get("foos").length;
  }.property("foos", "showingNewNote"),

  toggleNewNote: function() {
    this.set("showingNewNote", !this.get("showingNewNote"));
  },

  createNote: function(){
    this.get("content.foos").pushObject(App.Comment.create({
      body: this.get("note")
    }));
    this.set("note", "");
  }
});

//Views
//
App.DjpTextArea = Ember.TextArea.extend({
  rows: 1,
  didInsertElement: function() {
    this.set("original_content", this.get("value"));
  },

  change: function() {
    var isEmpty = this.get('value') === "";
    var noChange = this.get('original_content') === this.get('value');
    if (isEmpty || noChange) {
      this.set("controller.isSaved", true);
    } else {
      this.set("controller.isSaved", false);
    }
  }.observes("value"),

  keyDown: function(key) {
    if (key.which === 13) {
      this.set("rows", this.get("rows") + 1);
    } else if (key.which === 8) {
      var rows = this.get("rows");
      if (rows >= 1) {
        this.set("rows", rows - 1);
      }
    }
  }
});

App.NoteView = Ember.View.extend({
  classNames: "comment"
});

//Models
//
App.Comment = Ember.Object.extend({});
App.Line = Ember.Object.extend({});

App.Version = Ember.Object.extend({
  name: function() {
    return this.get("part.name");
  }.property("part.name"),

  comments: function() {
    return [
      App.Comment.create({id: "1", body: "That song totally rocks!"}),
      App.Comment.create({id: "2", body: "Could use a bit more base, no?"}),
      App.Comment.create({id: "3", body: "Turn it up to 11!"})
    ];
  }.property(),
});

App.Part = Ember.Object.extend({
  id: function() {
    return this.get("name");
  }.property("name"),

  comments: function() {
    return [
      App.Comment.create({id: "1", body: "That song totally rocks!"}),
      App.Comment.create({id: "2", body: "Could use a bit more base, no?"}),
      App.Comment.create({id: "3", body: "Turn it up to 11!"})
    ];
  }.property(),

  versions: function() {
    return [
      App.Version.create({
        id: "1",
        lines: [
          App.Line.create({ 
            id: "100",
            body: "Oh, if you want my eyes take my eyes, they're always true",
            foos: [
              App.Comment.create({id: "10", body: "test"}),
              App.Comment.create({id: "11", body: "test"})
            ]
          }),
          App.Line.create({ id: "1", body: "Oh, If you want my heart take my heart, it's right here for you", foos: [] }),
          App.Line.create({ id: "2", body: "Oh, it's been so long, but i made it through", foos: [] }),
          App.Line.create({ id: "3", body: "Oh it's been so long, been so long, but i made it through", foos: [] }),
          App.Line.create({ id: "4", body: "It's been so... long", foos: []})
        ],
        part: this
      })
    ];
  }.property()
});
