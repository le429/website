const htmlmin = require("html-minifier");
const MarkdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Copy `img/` to `_site/static`
  eleventyConfig.addPassthroughCopy("static");

  // Copy `la-redac/` to `_site/la-redac`
  eleventyConfig.addPassthroughCopy("la-redac");

  // Fix missing leading slash in src
  eleventyConfig.addTransform("srcLeadingSlashFix", function(content, outputPath) {
    if( !outputPath.endsWith(".html") ) {
      return content;
    }

    return content.replace(/src="static/g, 'src="/static')
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( !outputPath.endsWith(".html") ) {
      return content;
    }

    return htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
  });

  // Manual markdown parser
  eleventyConfig.addFilter("parseMarkdown", function(rawString) {
    return MarkdownIt().render(rawString);
  });

  // Date display 
  eleventyConfig.addFilter("parseDateForDisplay", function(date) {
    date = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // To UTC
    date = new Intl.DateTimeFormat('fr-FR').format(date); // To FR format
    return String(date);
  });

};
