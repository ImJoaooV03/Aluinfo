<?php get_header(); ?>

<main class="main-content">
    <div class="content-area">
        <!-- Anúncio Topo -->
        <div class="banner-ad medium">
            <span class="icon">🔗</span>
            <span>Publicidade</span>
            <span class="size-text">300x160</span>
        </div>

        <!-- Notícias Destaque -->
        <section class="section">
            <h2 class="section-title">Notícias Destaque</h2>
            <div class="news-grid featured">
                <?php
                $featured_posts = get_posts(array(
                    'posts_per_page' => 2,
                    'meta_key' => 'news_featured',
                    'meta_value' => '1'
                ));
                
                if ($featured_posts) :
                    foreach ($featured_posts as $post) :
                        setup_postdata($post);
                ?>
                        <article class="card news-card featured">
                            <a href="<?php the_permalink(); ?>">
                                <?php if (has_post_thumbnail()) : ?>
                                    <div class="news-image">
                                        <?php the_post_thumbnail('news-large'); ?>
                                    </div>
                                <?php endif; ?>
                                
                                <div class="card-content">
                                    <div class="news-meta">
                                        <span class="category-badge">
                                            <span>🏷</span>
                                            <?php the_category(', '); ?>
                                        </span>
                                        <span class="featured-badge">Destaque</span>
                                    </div>

                                    <h3 class="news-title featured"><?php the_title(); ?></h3>
                                    
                                    <p class="news-excerpt"><?php echo wp_trim_words(get_the_excerpt(), 25); ?></p>

                                    <div class="news-footer">
                                        <div class="author-info">
                                            <span>👤</span>
                                            <span><?php the_author(); ?></span>
                                        </div>
                                        <div class="date-info">
                                            <span>⏰</span>
                                            <span><?php echo human_time_diff(get_the_time('U'), current_time('timestamp')) . ' atrás'; ?></span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </article>
                <?php
                    endforeach;
                    wp_reset_postdata();
                else :
                    // Fallback content
                ?>
                    <article class="card news-card featured">
                        <div class="news-image">
                            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop" alt="Mercado de Alumínio">
                        </div>
                        <div class="card-content">
                            <div class="news-meta">
                                <span class="category-badge"><span>🏷</span> Mercado</span>
                                <span class="featured-badge">Destaque</span>
                            </div>
                            <h3 class="news-title featured">Mercado de Alumínio Registra Crescimento de 8% no Primeiro Semestre</h3>
                            <p class="news-excerpt">Análise completa dos fatores que impulsionaram o crescimento do setor de alumínio no Brasil, incluindo exportações e demanda interna.</p>
                            <div class="news-footer">
                                <div class="author-info"><span>👤</span> <span>Carlos Silva</span></div>
                                <div class="date-info"><span>⏰</span> <span>1h atrás</span></div>
                            </div>
                        </div>
                    </article>

                    <article class="card news-card featured">
                        <div class="news-image">
                            <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop" alt="Tecnologia">
                        </div>
                        <div class="card-content">
                            <div class="news-meta">
                                <span class="category-badge"><span>🏷</span> Tecnologia</span>
                                <span class="featured-badge">Destaque</span>
                            </div>
                            <h3 class="news-title featured">Nova Tecnologia de Reciclagem Promete Revolucionar Setor</h3>
                            <p class="news-excerpt">Processo inovador desenvolvido por startup brasileira pode aumentar em 40% a eficiência da reciclagem de alumínio.</p>
                            <div class="news-footer">
                                <div class="author-info"><span>👤</span> <span>Ana Santos</span></div>
                                <div class="date-info"><span>⏰</span> <span>2h atrás</span></div>
                            </div>
                        </div>
                    </article>
                <?php endif; ?>
            </div>
        </section>

        <!-- Anúncio Entre Seções -->
        <div class="banner-ad large">
            <span class="icon">🔗</span>
            <span>Publicidade</span>
            <span class="size-text">300x240</span>
        </div>

        <!-- Últimas Notícias -->
        <section class="section">
            <h2 class="section-title">Últimas Notícias</h2>
            
            <?php if (have_posts()) : ?>
                <div class="news-grid regular">
                    <?php while (have_posts()) : the_post(); ?>
                        <article class="card news-card">
                            <a href="<?php the_permalink(); ?>">
                                <?php if (has_post_thumbnail()) : ?>
                                    <div class="news-image">
                                        <?php the_post_thumbnail('medium'); ?>
                                    </div>
                                <?php endif; ?>
                                
                                <div class="card-content">
                                    <div class="news-meta">
                                        <span class="category-badge">
                                            <span>🏷</span>
                                            <?php the_category(', '); ?>
                                        </span>
                                    </div>

                                    <h3 class="news-title"><?php the_title(); ?></h3>
                                    
                                    <p class="news-excerpt"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>

                                    <div class="news-footer">
                                        <div class="author-info">
                                            <span>👤</span>
                                            <span><?php the_author(); ?></span>
                                        </div>
                                        <div class="date-info">
                                            <span>⏰</span>
                                            <span><?php echo human_time_diff(get_the_time('U'), current_time('timestamp')) . ' atrás'; ?></span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </article>
                    <?php endwhile; ?>
                </div>
                
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
        </section>
    </div>
    
    <?php get_sidebar(); ?>
</main>

<?php get_footer(); ?>