<?php get_header(); ?>

<main class="main-content">
    <div class="content-area">
        <h1>Últimas Notícias do Setor de Alumínio</h1>
        
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article class="news-card">
                    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    
                    <div class="news-meta">
                        <span>Por <?php the_author(); ?></span> • 
                        <span><?php echo get_the_date(); ?></span> • 
                        <span><?php the_category(', '); ?></span>
                    </div>
                    
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="news-image">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium', array('style' => 'width: 100%; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 1rem;')); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    
                    <div class="news-excerpt">
                        <?php the_excerpt(); ?>
                    </div>
                    
                    <a href="<?php the_permalink(); ?>" class="read-more">Leia mais →</a>
                </article>
            <?php endwhile; ?>
            
            <div class="pagination">
                <?php
                the_posts_pagination(array(
                    'prev_text' => '← Anterior',
                    'next_text' => 'Próximo →',
                ));
                ?>
            </div>
            
        <?php else : ?>
            <div class="no-posts">
                <h2>Nenhuma notícia encontrada</h2>
                <p>Não há conteúdo disponível no momento.</p>
            </div>
        <?php endif; ?>
    </div>
    
    <?php get_sidebar(); ?>
</main>

<?php get_footer(); ?>