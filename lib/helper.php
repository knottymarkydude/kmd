<?php

function _themename_post_meta() {
/* translators: %s Post Date */
printf(
  esc_html__( 'Posted on %s', '_themename' ),
  '<a href="' . esc_url(get_permalink()) . '"><time datetime="' . get_the_date('c') . '">' . esc_html(get_the_date()) . '</time></a>'
);

/* translators: %s Post Author */
printf(
  esc_html__( ' By %s', '_themename' ),
  '<a href="' . get_author_posts_url( get_the_author_meta('ID')) . '">' .
  esc_html(get_the_author()) . '</a>'

  );
}

function _themename_readmore_link() {
  echo  '<p><a href="' . esc_url(get_the_permalink()) .'" title="' . the_title_attribute(['echo' => false]) . '">';

  /* translators: %s Post Title */
  printf(
    wp_kses(
      __('Read more <span class="u-screen-reader-text"> about %s</span>', '_themename'),
      [
          'span' => [
            'class'  => []
          ]
      ]
    ),
    get_the_title()
  );

  echo('</a></p>');

}

?>
