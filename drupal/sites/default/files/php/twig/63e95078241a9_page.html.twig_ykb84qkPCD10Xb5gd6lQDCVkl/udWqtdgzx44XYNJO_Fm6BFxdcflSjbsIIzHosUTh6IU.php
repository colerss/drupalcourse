<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* themes/custom/google/templates/page.html.twig */
class __TwigTemplate_1e13267192a30880822c2294e13d1ddb extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $this->checkSecurity();
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "<style>
  ul {
    list-style-type: none;
    overflow: hidden;
  }

  li {
    float: right;
  }

  li a {
    color: #000;
    display: block;
    text-align: center;
    padding: 10px 10px;
    text-decoration: none;
    font-size:14px;
  }
  li a:hover {
    text-decoration: underline;
  }
  .grid{
    height:23px;
    position:relative;
    bottom:4px;
  }
  .signbutton{
    background-color: #4885ed;
    color: #fff;
    border:none;
    border-radius:3px;
    padding:7px 10px;
    position:relative;
    bottom:7px;
    font-weight:bold;
  }
  .logo{
    margin-top:200px;
    margin-bottom:20px;
  }
  .bar{
    margin:0 auto;
    width:575px;
    border-radius:30px;
    border:1px solid #dcdcdc;
  }
  .bar:hover{
    box-shadow: 1px 1px 8px 1px #dcdcdc;
  }
  .bar:focus-within{
    box-shadow: 1px 1px 8px 1px #dcdcdc;
    outline:none;
  }
  .searchbar{
    height:45px;
    border:none;
    width:500px;
    font-size:16px;
    outline: none;

  }
  .voice{
    height:20px;
    position:relative;
    top:5px;
    left:10px;
  }
  .buttons{
    margin-top:30px;
  }
  .button{
    background-color: #f5f5f5;
    border:none;
    color:#707070;
    font-size:15px;
    padding: 10px 20px;
    margin:5px;
    border-radius:4px;
    outline:none;
  }
  .button:hover{
    border: 1px solid #c8c8c8;
    padding: 9px 19px;
    color:#808080;
  }
  .button:focus{
    border:1px solid #4885ed;
    padding: 9px 19px;
  }


</style>

<!DOCTYPE html>
<html>
  <center>
    <header>
        <ul>
         <li><a class=\"links\" href=\"#user\"><button class=\"signbutton\" type=\"button\">Sign in</button></a></li>
           <li><a href=\"#grid\"><img class=\"grid\" src=\"https://cdn3.iconfinder.com/data/icons/navigation-and-settings/24/Material_icons-01-11-512.png\" title=\"Google apps\"></a></li>
          <li><a href=\"#images\">Images</a></li>
          <li><a href=\"#gmail\">Gmail</a></li>
          </ul>
    </header>
    <div class=\"logo\">
      <img alt=\"Google\" src=\"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png\">
    </div>
    <div class=\"bar\">
      <input class=\"searchbar\" type=\"text\" title=\"Search\">
      <a href=\"#\"> <img class=\"voice\" src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Google_mic.svg/716px-Google_mic.svg.png\" title=\"Search by Voice\"></a>
    </div>
    <div class=\"buttons\">
      <button class=\"button\" type=\"button\">Google Search</button>
      <button class=\"button\" type=\"button\">I'm Feeling Lucky</button>
     </div>
  </body>
  </center>
</html>

";
    }

    public function getTemplateName()
    {
        return "themes/custom/google/templates/page.html.twig";
    }

    public function getDebugInfo()
    {
        return array (  39 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "themes/custom/google/templates/page.html.twig", "C:\\xampp\\htdocs\\drupal\\themes\\custom\\google\\templates\\page.html.twig");
    }
    
    public function checkSecurity()
    {
        static $tags = array();
        static $filters = array();
        static $functions = array();

        try {
            $this->sandbox->checkSecurity(
                [],
                [],
                []
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->source);

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }
}
