/*Bryan Nissen - Bryan@Webizly.com*/
/*global window, Backbone,  document, Handlebars,  jQuery*/
(function($) {"use strict";

    /////-----     MODELS     -----/////

    window.Video = Backbone.Model.extend({});
    
    window.Controller = Backbone.Model.extend({
       defaults:{
           current: 0
       } 
    });
    
    /////-----  COLLECTIONS  -----/////
    
    window.Videos = Backbone.Collection.extend({
        model: window.Video,
        url: 'json/videos.json',
        
        initialize : function() {
            this.fetch({
                //update : true
            });
        }
    });

    window.videos = new window.Videos();
    window.controller = new window.Controller();
    
    $(document).ready(function() {
        
        /////-----     VIEWS     -----/////
        
        window.PlayerView = Backbone.View.extend({
           template: Handlebars.compile($('#PlayerView-template').html()),
           
           initialize : function () {
               this.controller = this.options.controller;
               
               this.controller.bind('change:current', this.changeVideo, this);
           },
           
           render: function () {
               $(this.el).html(this.template(this.model.toJSON()));
               return this;
           },
           
           changeVideo: function () {
               var current = this.controller.get('current');
               console.log(current)
               var    model = this.collection.at(current);
                   
               this.model = model;
               this.render();
           }
        });
        
        window.VideoView = Backbone.View.extend({
            template: Handlebars.compile($('#VideoView-template').html()),
            
            initialize: function () {
                this.controller = this.options.controller;
            },
            
            render: function () {
                $(this.el).append(this.template(this.model.toJSON()));
                return this;
            }
        });
        
        window.VideoAppView = Backbone.View.extend({
            template: Handlebars.compile($('#VideoAppView-template').html()),
            
            events: {
                'click .video' : 'selectVideo'  
            },
            
            initialize: function () {
                this.controller = this.options.controller;
                
                this.collection.bind('reset', this.render, this);
                this.collection.bind('add', this.render, this);
            },
            
            render: function () {
                var collection = this.collection, 
                    controller = this.controller,
                    view,
                    model = collection.at(controller.get("current"))
                $(this.el).html(this.template({}));
                console.log(model, collection.at(collection.models.length-1))
                if(model){
                    view = new window.PlayerView({
                        model: model,
                        el: $('#videoPlayer'),
                        collection: collection,
                        controller: controller
                    });
                    view.render();
                }
                collection.each(function(video){
                    view = new window.VideoView({
                        model: video,
                        el: $('#videoList'),
                        controller: controller
                    });
                    view.render();
                });
            },
            
            selectVideo: function(event) {
                var id = $(event.currentTarget).data('id');
                console.log(id)
                this.controller.set({
                    current: id
                });
            }
        });
        
        window.App = Backbone.Router.extend({
            routes: {
                '' : 'home'
            },
            
            initialize: function() {
                this.appView = new VideoAppView({
                    el: $('#videoApp'),
                    collection: window.videos,
                    controller: window.controller
                });
                this.appView.render();
            },

        });
        
        $(function() {
            window.App = new App();
            Backbone.history.start();
        });
         
    });

}(jQuery)); 