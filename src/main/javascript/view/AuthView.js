'use strict';

SwaggerUi.Views.AuthView = Backbone.View.extend({
    events: {
        'click .auth_submit_button': 'authorizeClick',
        'click .auth_logout__button': 'logoutClick'
    },

    tpls: {
        main: Handlebars.templates.auth_view
    },

    selectors: {
        innerEl: '.auth_inner'
    },

    initialize: function(opts) {
        this.options = opts || {};
        opts.data = opts.data || {};
        this.router = this.options.router;

        this.collection = new SwaggerUi.Collections.AuthsCollection();
        this.collection.add(this.parseData(opts.data));

        this.$el.html(this.tpls.main({isLogout: this.collection.isAuthorized()}));
        this.$innerEl = this.$(this.selectors.innerEl);
    },

    render: function () {
        this.renderAuths();

        if (!this.$innerEl.html()) {
            this.$el.html('');
        }

        return this;
    },

    authorizeClick: function (e) {
        e.preventDefault();

        if (this.collection.isValid()) {
            this.authorize();
        }
    },

    parseData: function (data) {
        var authz = window.swaggerUi.api.clientAuthorizations.authz;

        return _.map(data, function (auth, name) {
            var isBasic = authz.basic && auth.type === 'basic';

            if (authz[name] || isBasic) {
                _.extend(auth, {
                    isLogout: true,
                    value: isBasic ? '' : authz[name].value,
                    valid: true
                });
            }

            return auth;
        });
    },

    renderAuths: function () {
        this.collection.each(function (auth) {
            this.renderOneAuth(auth);
        }, this);
    },

    renderOneAuth: function (authModel) {
        var authEl;
        var type = authModel.get('type');

        //todo refactor move view name into var and call new with it.
        if (type === 'apiKey') {
            authEl = new SwaggerUi.Views.ApiKeyAuthView({model: authModel, router: this.router}).render().el;
        } else if (type === 'basic' && this.$innerEl.find('.basic_auth_container').length === 0) {
            authEl = new SwaggerUi.Views.BasicAuthView({model: authModel, router: this.router}).render().el;
        } else if (type === 'oauth2') {
            authEl = new SwaggerUi.Views.Oauth2View({model: authModel, router: this.router}).render().el;
        }

        this.$innerEl.append(authEl);
    },

    authorize: function () {
        this.collection.forEach(function (auth) {
            var keyAuth, basicAuth;
            var type = auth.get('type');

            if (type === 'apiKey') {
                keyAuth = new SwaggerClient.ApiKeyAuthorization(
                    auth.get('name'),
                    auth.get('value'),
                    auth.get('in')
                );

                this.router.api.clientAuthorizations.add(auth.get('name'), keyAuth);
            } else if (type === 'basic') {
                basicAuth = new SwaggerClient.PasswordAuthorization(auth.get('username'), auth.get('password'));
                this.router.api.clientAuthorizations.add(auth.get('type'), basicAuth);
            } else if (type === 'oauth2') {
                //todo add handling login of oauth2
            }
        }, this);

        this.router.load();
    },

    logoutClick: function (e) {
        e.preventDefault();

        this.collection.forEach(function (auth) {
            var name = auth.get('name');

            window.swaggerUi.api.clientAuthorizations.remove(name);
        });

        this.router.load();
    }
});
