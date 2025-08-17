<?php get_header(); ?>

<main class="main-content">
    <div class="content-area">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article class="page-content">
                    <header class="page-header">
                        <h1 class="page-title"><?php the_title(); ?></h1>
                        
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="page-thumbnail" style="margin: 1.5rem 0;">
                                <?php the_post_thumbnail('news-large', array('style' => 'width: 100%; height: 300px; object-fit: cover; border-radius: 8px;')); ?>
                            </div>
                        <?php endif; ?>
                    </header>
                    
                    <div class="page-content" style="line-height: 1.8; font-size: 1.1rem;">
                        <?php the_content(); ?>
                    </div>
                    
                    <?php
                    wp_link_pages(array(
                        'before' => '<nav class="page-links"><span class="page-links-title">Páginas:</span>',
                        'after'  => '</nav>',
                        'link_before' => '<span>',
                        'link_after'  => '</span>',
                    ));
                    ?>
                </article>
                
                <?php
                // Comentários em páginas (se habilitado)
                if (comments_open() || get_comments_number()) {
                    echo '<div style="margin-top: 3rem;">';
                    comments_template();
                    echo '</div>';
                }
                ?>
                
            <?php endwhile; ?>
        <?php endif; ?>
    </div>
    
    <?php get_sidebar(); ?>
</main>

<?php get_footer(); ?>