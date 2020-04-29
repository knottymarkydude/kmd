<?php
 /**
  * The main template file
  *
  * This is the most generic template file in a WordPress theme
  * It is used to display a page when nothing more specific matches a query.
  * E.g., it puts together the home page when no home.php file exists.
  *
  *  <pre>
  *   <?php var_dump($wp_query); ?>
  * </pre>
  *
  * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
  *
  * @package _themename
  */

 get_header();
 ?>

 <?php if (have_posts()) { ?>
     <?php while (have_posts()) { ?>
       <?php the_post(); ?>
         <h2>
           <a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title() ?></a>
         </h2>
         <div>
           <?php _themename_post_meta(); ?>
         </div>
         <div>
           <?php the_excerpt(); ?>
         </div>
         <div>
           <?php _themename_readmore_link(); ?>
         </div>
         <?php the_posts_pagination(); ?>
         <?php do_action( '_themename_after_pagination'); ?>
       <?php } ?>
   <?php }else{ ?>
     <p><?php echo apply_filters( "_themename_no_posts_ext", esc_html__('Sorry no posts matched your criteria.', '_themename')) ?> </p>
   <?php } ?>

   <?php
   $comments = 3;

   printf(_n('One comment', '%s comments', $comments, '_themename'), $comments);
   ?>

 <?php
 get_footer();
 ?>
