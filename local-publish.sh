#  build
gulp --production

## assets.idos.io
cp  /home/rafael/Projects/veridu/idos/widgets/embedded-widget-2.0/bin/js/main.js /home/rafael/Projects/veridu/idos/assets/js/embedded-widget.js
cp -R /home/rafael/Projects/veridu/idos/widgets/embedded-widget-2.0/bin/img/* /home/rafael/Projects/veridu/idos/assets/img/embedded-widget/

## widget.idos.io
cp /home/rafael/Projects/veridu/idos/widgets/embedded-widget-2.0/bin/js/main.js /home/rafael/Projects/veridu/idos/api/resources/embedded-widget.js
cp /home/rafael/Projects/veridu/idos/widgets/embedded-widget-2.0/bin/js/main.js /home/rafael/Projects/veridu/idos/handlers/idos-widget/resources/embedded-widget.js