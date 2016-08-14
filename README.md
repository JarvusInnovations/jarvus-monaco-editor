# jarvus-monaco-editor
An ExtJS wrapper for the Monaco editor

This is currently in the early stages of development.

## Package usage
1.  Clone jarvus-monaco-editor repository into `${workspace.dir}/packages`
2.  Add `"jarvus-monaco-editor"` to the `"requires"` array in `${app.dir}/app.json`
3.  Add `"Jarvus.monaco.Editor"` to `requires` array in your Ext JS classes that use the `jarvus-monaco-editor` xtype

##Example usage:

```
Ext.define('MyApp.view.Editor', {
    extend: 'Ext.Panel',
    xtype: 'myapp-editor',
    requires: [
        'Jarvus.monaco.Editor'
    ],

    layout: 'fit',

    items: [{
        xtype: 'jarvus-monaco-editor',
        language: 'sql', // default: "javascript"
        source: 'dev', // "min" (minified) or "dev", default: "min"
        subscribe: [
            'onMouseDown' // monaco "onMouseDown" event will be bubbled up to the jarvus-monaco-editor component
        ],
        content: [
            'SELECT ID, FirstName, Lastname',
            'FROM people',
            'WHERE Lastname = "Barkley"'
        ].join('\n')
    }]
});
```

