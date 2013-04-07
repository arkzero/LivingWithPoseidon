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
        model: window.Character,
        url: 'json/videos/json',
        
        initialize: function () {
            this.fetch({
                update: true
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
               
               this.controller.bind('change:current', this.render, this);
           },
           
           render: function () {
               $(this.el).append(this.template(this.model.toJSON()));
               return this;
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
            
            initialize: function () {
                this.controller = this.options.controller;
                
                this.collection.bind('reset', this.render, this);
                this.collection.bind('add', this.render, this);
            },
            
            render: function () {
                var collection = this.collection, 
                    controller = this.controller,
                    view,
                    model = collection.at(collection.models.legth-1);
                
                $(this.el).html(this.template({}));
                
                view = new window.PlayerView({
                    model: model,
                    el: $('#videoPlayer'),
                    controller: controller
                })
                
                collection.each(function(video){
                    view = new window.VideoView({
                        model: video,
                        el: $('#videoList'),
                        controller: controller
                    });
                    view.render();
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
                })
            }
        })
         
    });

}(jQuery)); 