<template>
  <button @click="render">render</button>
  <iframe
    style="top: 0;background: #fff;"
    class="edit-area"
    id="preview"
    frameborder="0"
    srcdoc='<!DOCTYPE html>
    <html>
        <head>
            <style type="text/css">
            </style>
        </head>
        <body>
            <script type="text/javascript">
            </script>
        </body>
    </html>'
  ></iframe>
</template>

<script>
export default {
  name: "Preview",
  props: {
    htmlCode: String,
    cssCode: String,
    javascriptCode: String,
  },
  methods: {
    render() {
      var htmlStr =
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        '<style type="text/css">' +
        this.cssCode +
        "</style>" +
        "</head>" +
        "<body>" +
        this.htmlCode +
        '<script type="text/javascript">' +
        this.javascriptCode +
        "</" +
        "script>" +
        "</body>" +
        "</html>";
      document.getElementById("preview").srcdoc = htmlStr;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
