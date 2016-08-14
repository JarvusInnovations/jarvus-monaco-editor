/*jslint browser: true, undef: true *//*global Ext*/
/**
 *
 */
Ext.define('Jarvus.monaco.Editor', {
    extend: 'Ext.Component',
    xtype: 'jarvus-monaco-editor',

    config: {
        source: 'min', // "min" or "dev"
        content: null,
        language: 'javascript',
        monaco: null,
        subscribe: []
    },

    listeners: {
        resize: 'onResize'
    },

    /**
     * Modern toolkit does not have the "afterRender" method that exists in the classic toolkit so on initialize
     * a listener is added for the first firing of the painted event which calls afterRender
     */
    initialize: function() {
        var me = this;

        me.on('painted', function() {
            me.afterRender();
            // painted isn't listenable in the controller, this will fire it once
            me.fireEvent('painted', me);
        }, me, {single: true});
    },

    afterRender: function() {
        var me = this;

        me.initEditor();
    },

    initEditor: function() {
        var me = this;

        require.config({
            /*
             * TODO: is there a better way to set this path? See discussion here:
             * https://www.sencha.com/forum/showthread.php?291559-Referencing-resources-from-packages-in-dev-mode
             * For this to work in dev mode, you must build build the app at least once
             */
            baseUrl: '../build/production/EmergenceDbtool/resources/jarvus-monaco-editor/monaco-editor',
            paths: {
                'vs': me.getSource()+'/vs'
            }
        });

        require(['vs/editor/editor.main'], function() {
            var subscribe = me.getSubscribe(),
                subscribeLength = subscribe.length,
                i = 0,
                editor, evnt;

            editor = monaco.editor.create(me.getEl().dom, {
                value: me.getContent(),
                language: me.getLanguage()
            });
            me.setMonaco(editor);

            console.log(subscribe);

            for (; i<subscribeLength; i++) {
                evnt = subscribe[i];
                console.log(evnt);
                editor[evnt](function() {
                    console.log('mousedown!!!!');
                    console.log('monaco-'+evnt.toLowerCase());
                    me.fireEvent(evnt.toLowerCase(),me,arguments);
                });
            }
            /*
            editor.onMouseDown(function (e) {
                console.log('mousedown - ' + e.target.toString());
            });
            */
        });
    },

    onResize: function() {
        var monaco = this.getMonaco();

        if (monaco && monaco.layout) {
            monaco.layout();
        }
    }

});
