# Swagger UI for Roboconf

This is a fork of Swagger UI (following version 2.1.4).  
We made small modifications for our embedded version of Swagger UI on Roboconf's web site.
Maintaining a fork will be easier than documenting how to update the original project for our requirements.

<img src="http://roboconf.net/resources/img/readme_swagger_ui.png" alt="Swagger UI for Roboconf" />

Main differences with the original version:

* The **dist** directory is not shared on Github. It can be built when necessary.
* The **dist** directory was [removed from the repository's history](http://dalibornasevic.com/posts/2-permanently-remove-files-and-folders-from-git-repo),
as it is quite big (> 2 MB). It was removed in both the master and the tags. The repository's size dropped from about 60 Mb to 6 Mb.
* Some CSS customizations, as well as modifications to the Handlebars templates.
* Enhanced build process (in particular in dev' mode - PR submitted).
* Apply a PR from the original repository to prevent XSS attacks.
* Review the loading mechanism to only accept *swagger.json* files hosted on Roboconf's Maven repositories.
* Remove useless translations, the *specs* directory and *o2.c.html* as we do not use it.

For more information, please refer to the [original readme](Swagger_UI_README.md).


## Build and Test

```properties
# Install dependencies
sudo npm install
npm install

# Build the "dist" directory
npm run build

# Live Development (open http://localhost:8080 in your web browser)
npm run serve
```


## Insert into Roboconf's web site

* Build the **dist** directory.
* Copy it under the **swagger** directory of the web site (roboconf.github.io).
* That's it! ;)


## Parameters

* **url**: the URL of the swagger.json file to read.  
Must start with `http://roboconf.net/` or `http://localhost`.

At the beginning, we hoped we could reference directly swagger.json files
from Maven repositories. But we face CORS issues in web browsers.

If the URL contains the **rest** sequence of characters, then it is considered to display the documentation
for the REST API. Otherwise, it will display read special elements that are specific for our web socket.


## License

Copyright 2016 SmartBear Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---
<img src="http://swagger.io/wp-content/uploads/2016/02/logo.jpg"/>
