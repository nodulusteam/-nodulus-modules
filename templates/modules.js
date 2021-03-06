module.exports =  {
    "@nodulus/modules": {
        "state": "locked",
        "files": [
            "modules.js",
            "modules.html",
            "template/about.html",
            "template/manifest.json",
            "template/template.html",
            "template/template.js",
            "template/routes/template.js",
            "nav.html",
            "cms_nav.html"
        ],
        "scripts": [
            "nav.js"
        ],
        "navname": "modules_nav",
        "dependencies": [
            "nodulus_modules"
        ],
        "routes": [
            {
                "route": "/",
                "path": "modules.js"
            }
        ],
        "module": {
            "name": "@nodulus/modules"
        },
        "npm": "@nodulus/modules",
        "navigation": []
    },
    "@nodulus/users": {
        "state": "locked",
        "files": [],
        "scripts": [],
        "dependencies": [],
        "routes": [
            {
                "route": "/",
                "path": "users.js"
            }
        ],
        "module": {
            "name": "@nodulus/users"
        },
        "npm": "@nodulus/users",
        "navigation": []
    },
    "@nodulus/translations": {
        "state": "locked",
        "files": [
            "Languages.js",
            "Languages.html",
            "Language.html",
            "Language.js"
        ],
        "scripts": [],
        "dependencies": [],
        "routes": [
            {
                "route": "/",
                "path": "translations.js"
            }
        ],
        "module": {
            "name": "@nodulus/translations"
        },
        "npm": "@nodulus/translations",
        "navigation": [
            {
                "_id": "translations",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Name": "Translations",
                "label": "Translations",
                "Url": "/@nodulus/translations/Languages.html",
                "Alias": "translations"
            }
        ]
    }
}