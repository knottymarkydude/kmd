<?php

require_once('lib/helper.php');
require_once('lib/enqueue-assets.php');

function after_pagination() {
  echo 'pagination';
}

function after_pagination2() {
  echo 'pagination2';
}

add_action('_themename_after_pagination', 'after_pagination', 2);
add_action('_themename_after_pagination', 'after_pagination2', 1);

function no_posts_text($text) {
  return 'no posts definately not';
}
add_filter( '_themename_no_posts_ext', 'no_posts_text', 10, 1 );

?>
