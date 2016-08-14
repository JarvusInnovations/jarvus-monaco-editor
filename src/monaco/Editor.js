/*jslint browser: true, undef: true *//*global Ext*/
/**
 * An ExtJS component wrapper for the Monaco editor
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
        this.initEditor();
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

            // Create the Monaco editor
            editor = monaco.editor.create(me.getEl().dom, {
                value: me.getContent(),
                language: me.getLanguage()
            });
            me.setMonaco(editor);

            // Bubble subscribed events from Monaco
            // TODO: Will any of the Monaco event names conflict with Ext.Component event names?
            for (; i<subscribeLength; i++) {
                evnt = subscribe[i];
                editor[evnt](function() {
                    me.fireEvent(evnt.toLowerCase(),me,arguments);
                });
            }
        });
    },

    onResize: function() {
        var monaco = this.getMonaco();

        if (monaco && monaco.layout) {
            monaco.layout();
        }
    }

});
