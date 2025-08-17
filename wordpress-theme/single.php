<?php get_header(); ?>

<main class="main-content">
    <div class="content-area">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article class="single-post">
                    <header class="post-header">
                        <h1 class="post-title"><?php the_title(); ?></h1>
                        
                        <div class="post-meta" style="margin: 1rem 0; padding: 1rem 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 0.875rem;">
                            <span>Por <strong><?php the_author(); ?></strong></span> • 
                            <span><?php echo get_the_date(); ?></span> • 
                            <span><?php the_category(', '); ?></span> • 
                            <span><?php echo get_post_meta(get_the_ID(), 'news_views', true) ?: '0'; ?> visualizações</span>
                        </div>
                        
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="post-thumbnail" style="margin: 1.5rem 0;">
                                <?php the_post_thumbnail('news-large', array('style' => 'width: 100%; height: 400px; object-fit: cover; border-radius: 8px;')); ?>
                            </div>
                        <?php endif; ?>
                    </header>
                    
                    <div class="post-content" style="line-height: 1.8; font-size: 1.1rem;">
                        <?php the_content(); ?>
                    </div>
                    
                    <footer class="post-footer" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
                        <?php the_tags('<div class="post-tags" style="margin-bottom: 1rem;"><strong>Tags:</strong> ', ', ', '</div>'); ?>
                        
                        <div class="post-share" style="margin-bottom: 1rem;">
                            <strong>Compartilhar:</strong>
                            <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()); ?>" target="_blank" style="margin-left: 0.5rem; color: #3b82f6;">Facebook</a>
                            <a href="https://twitter.com/intent/tweet?url=<?php echo urlencode(get_permalink()); ?>&text=<?php echo urlencode(get_the_title()); ?>" target="_blank" style="margin-left: 0.5rem; color: #3b82f6;">Twitter</a>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=<?php echo urlencode(get_permalink()); ?>" target="_blank" style="margin-left: 0.5rem; color: #3b82f6;">LinkedIn</a>
                        </div>
                        
                        <div class="author-bio" style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                            <h3 style="margin-bottom: 0.5rem; color: #1e40af;">Sobre o Autor</h3>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <?php echo get_avatar(get_the_author_meta('ID'), 60, '', '', array('style' => 'border-radius: 50%;')); ?>
                                <div>
                                    <strong><?php the_author(); ?></strong>
                                    <p style="margin: 0.5rem 0 0; color: #6b7280;"><?php echo get_the_author_meta('description') ?: 'Especialista no setor de alumínio e fundição.'; ?></p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </article>
                
                <!-- Navegação entre posts -->
                <nav class="post-navigation" style="margin: 2rem 0; display: flex; justify-content: space-between; gap: 1rem;">
                    <div class="nav-previous">
                        <?php previous_post_link('%link', '← %title'); ?>
                    </div>
                    <div class="nav-next">
                        <?php next_post_link('%link', '%title →'); ?>
                    </div>
                </nav>
                
                <!-- Posts relacionados -->
                <section class="related-posts" style="margin-top: 3rem;">
                    <h3 style="margin-bottom: 1.5rem; color: #1e40af;">Notícias Relacionadas</h3>
                    
                    <?php
                    $categories = get_the_category();
                    if ($categories) {
                        $category_ids = array();
                        foreach($categories as $category) {
                            $category_ids[] = $category->term_id;
                        }
                        
                        $related_posts = get_posts(array(
                            'category__in' => $category_ids,
                            'post__not_in' => array(get_the_ID()),
                            'posts_per_page' => 3,
                            'orderby' => 'rand'
                        ));
                        
                        if ($related_posts) {
                            echo '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">';
                            foreach ($related_posts as $related_post) {
                                setup_postdata($related_post);
                                ?>
                                <div class="news-card">
                                    <h4><a href="<?php echo get_permalink($related_post->ID); ?>"><?php echo get_the_title($related_post->ID); ?></a></h4>
                                    <div class="news-meta">
                                        <span><?php echo get_the_date('', $related_post->ID); ?></span>
                                    </div>
                                    <div class="news-excerpt">
                                        <?php echo wp_trim_words(get_the_excerpt($related_post->ID), 15); ?>
                                    </div>
                                    <a href="<?php echo get_permalink($related_post->ID); ?>" class="read-more">Leia mais →</a>
                                </div>
                                <?php
                            }
                            echo '</div>';
                            wp_reset_postdata();
                        }
                    }
                    ?>
                </section>
                
                <!-- Comentários -->
                <?php
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