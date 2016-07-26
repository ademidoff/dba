# DB Administrator

This app is supposed to help the DBA people to help administer MSSQL, Postgres, MySQL and MariaDB
databases. The server part is based on Node.js, Express.js and Sequelize.js (the latter being
a NodeJS module that does a great job of abstracting away differences in SQL engines).

The following files are all needed to build and load the application.

 - `app.js` - The file that launches the application. This is primarily used to
   launch an instance of the `Application` class.
 - `index.html` - The default web page for this application. This can be customized
   in `app.json`.

## Basic Application Structure

Applications that target a single toolkit will have the following structure.

    app/                # Contains JavaScript code
        model/          # Data model classes
        view/           # Views as well as ViewModels and ViewControllers
        store/          # Data stores
        controller/     # Global / application-level controllers

    overrides/          # JavaScript code that is automatically required

    sass/
        etc/            # Misc Sass code (all.scss is imported by default)
        var/            # Sass variable and mixin declarations
        src/            # Sass rules

    resources/          # Assets such as images, fonts, etc.

## Universal Applications

In a Universal Application, the basic application structure above is retained but
only holds code, resources, etc. pieces that are used in both classic and modern
build profiles. The following additional directories are used to isolate code and
other files that are toolkit-specific:

    classic/                # Content specific to the classic toolkit
        src/
            model/          # Data model classes
            view/           # Views as well as ViewModels and ViewControllers
            store/          # Data stores
            controller/     # Global / application-level controllers

        overrides/          # JavaScript code that is automatically required

        sass/
            etc/            # Misc Sass code (all.scss is imported by default)
            var/            # Sass variable and mixin declarations
            src/            # Sass rules

        resources/          # Assets such as images, fonts, etc.

    modern/                 # Content specific to the modern toolkit
        src/
            model/          # Data model classes
            view/           # Views as well as ViewModels and ViewControllers
            store/          # Data stores
            controller/     # Global / application-level controllers

        overrides/          # JavaScript code that is automatically required

        sass/
            etc/            # Misc Sass code (all.scss is imported by default)
            var/            # Sass variable and mixin declarations
            src/            # Sass rules

        resources/          # Assets such as images, fonts, etc.

## Overrides

The contents of "overrides" folders are automatically required and included in
builds. These should not be explicitly mentioned in "requires" or "uses" in code.
This area is intended for overrides like these:

    Ext.define('SM.overrides.foo.Bar', {
        override: 'Ext.foo.Bar',
        ...
    });

Such overrides, while automatically required, will only be included if their target
class ("Ext.foo.Bar" in this case) is also required. This simplifies applying
patches or extensions to other classes.


# FIELDS / DATA TYPES
--------------------------
- BOOLEAN       (NAME, SYSTEM, LABEL, SORT, SEARCH, REQUIRED, READONLY, HIDDEN)
- COMPLEX_TYPE  (NAME, SYSTEM, LABEL, REQUIRED, READONLY, HIDDEN, REFERENCE TO)
- DATE_TIME     (NAME, SYSTEM, LABEL, SORT, SEARCH, UNIQUENESS, REQUIRED, READONLY, HIDDEN)
- ENTITY_LINK   (NAME, SYSTEM, LABEL, SORT, SEARCH, REQUIRED, READONLY, HIDDEN, REFERENCE TO)
- ENUM          (NAME, SYSTEM, LABEL, SORT, SEARCH, UNIQUENESS, REQUIRED, READONLY, HIDDEN, REFERENCE TO)
- ENUM_SET      (NAME, SYSTEM, LABEL, SORT, SEARCH, REQUIRED, READONLY, HIDDEN, REFERENCE TO)
- INTEGER       (NAME, SYSTEM, LABEL, SORT, SEARCH, UNIQUENESS, REQUIRED, READONLY, HIDDEN)
- LARGE_TEXT    (NAME, SYSTEM, LABEL, REQUIRED, READONLY, HIDDEN)
- MANY2MANY     (NAME, LABEL)
- MEDIUM_TEXT   (NAME, SYSTEM, LABEL, SORT, REQUIRED, READONLY, HIDDEN)
- RICH_TEXT     (NAME, SYSTEM, LABEL, REQUIRED, READONLY, HIDDEN)
- SMALL_TEXT    (NAME, SYSTEM, LABEL, SORT, SEARCH, UNIQUENESS, REQUIRED, READONLY, HIDDEN, TOOLTIP, PLACEHOLDER)
