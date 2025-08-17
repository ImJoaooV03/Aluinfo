<aside class="sidebar">
    <?php if (is_active_sidebar('main-sidebar')) : ?>
        <?php dynamic_sidebar('main-sidebar'); ?>
    <?php else : ?>
        
        <!-- Widget de Notícias Populares -->
        <div class="widget">
            <h3>Notícias Populares</h3>
            <ul>
                <?php
                $popular_posts = get_posts(array(
                    'posts_per_page' => 5,
                    'meta_key' => 'news_views',
                    'orderby' => 'meta_value_num',
                    'order' => 'DESC'
                ));
                
                if ($popular_posts) :
                    foreach ($popular_posts as $post) :
                        setup_postdata($post);
                ?>
                        <li>
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            <small style="display: block; color: #6b7280; margin-top: 0.25rem;">
                                <?php echo get_post_meta(get_the_ID(), 'news_views', true) ?: '0'; ?> visualizações
                            </small>
                        </li>
                <?php
                    endforeach;
                    wp_reset_postdata();
                else :
                ?>
                    <li><a href="#">Inovações em Ligas de Alumínio</a></li>
                    <li><a href="#">Mercado Global do Alumínio</a></li>
                    <li><a href="#">Sustentabilidade na Fundição</a></li>
                    <li><a href="#">Novas Tecnologias de Moldagem</a></li>
                    <li><a href="#">Reciclagem de Alumínio</a></li>
                <?php endif; ?>
            </ul>
        </div>
        
        <!-- Widget de Categorias -->
        <div class="widget">
            <h3>Categorias</h3>
            <ul>
                <?php
                $categories = get_categories(array('hide_empty' => false));
                if ($categories) :
                    foreach ($categories as $category) :
                ?>
                        <li>
                            <a href="<?php echo get_category_link($category->term_id); ?>">
                                <?php echo $category->name; ?>
                                <span style="color: #6b7280;">(<?php echo $category->count; ?>)</span>
                            </a>
                        </li>
                <?php
                    endforeach;
                else :
                ?>
                    <li><a href="#">Mercado <span style="color: #6b7280;">(15)</span></a></li>
                    <li><a href="#">Tecnologia <span style="color: #6b7280;">(12)</span></a></li>
                    <li><a href="#">Sustentabilidade <span style="color: #6b7280;">(8)</span></a></li>
                    <li><a href="#">Inovação <span style="color: #6b7280;">(10)</span></a></li>
                    <li><a href="#">Fornecedores <span style="color: #6b7280;">(6)</span></a></li>
                <?php endif; ?>
            </ul>
        </div>
        
        <!-- Widget de Newsletter -->
        <div class="widget" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 1.5rem; border-radius: 8px;">
            <h3 style="color: white; margin-bottom: 1rem;">Newsletter</h3>
            <p style="margin-bottom: 1rem; font-size: 0.875rem;">
                Receba as últimas notícias do setor de alumínio diretamente no seu e-mail.
            </p>
            <form style="display: flex; flex-direction: column; gap: 0.75rem;">
                <input type="email" placeholder="Seu e-mail" style="padding: 0.75rem; border: none; border-radius: 4px; font-size: 0.875rem;">
                <button type="submit" style="padding: 0.75rem; background: white; color: #1e40af; border: none; border-radius: 4px; font-weight: 500; cursor: pointer;">
                    Inscrever-se
                </button>
            </form>
        </div>
        
        <!-- Widget de Banner -->
        <div class="widget">
            <h3>Anuncie Aqui</h3>
            <div style="background: #f8fafc; border: 2px dashed #d1d5db; padding: 2rem; text-align: center; border-radius: 8px;">
                <p style="color: #6b7280; margin-bottom: 1rem;">Seu anúncio aqui</p>
                <p style="font-size: 0.875rem; color: #9ca3af;">300x250px</p>
                <a href="#" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Anunciar</a>
            </div>
        </div>
        
        <!-- Widget de Tags -->
        <div class="widget">
            <h3>Tags Populares</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <?php
                $tags = get_tags(array('number' => 10));
                if ($tags) :
                    foreach ($tags as $tag) :
                ?>
                        <a href="<?php echo get_tag_link($tag->term_id); ?>" 
                           style="display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; text-decoration: none; transition: background 0.3s ease;"
                           onmouseover="this.style.background='#3b82f6'; this.style.color='white';"
                           onmouseout="this.style.background='#e5e7eb'; this.style.color='#374151';">
                            <?php echo $tag->name; ?>
                        </a>
                <?php
                    endforeach;
                else :
                ?>
                    <a href="#" style="display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; text-decoration: none;">alumínio</a>
                    <a href="#" style="display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; text-decoration: none;">fundição</a>
                    <a href="#" style="display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; text-decoration: none;">reciclagem</a>
                    <a href="#" style="display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; text-decoration: none;">tecnologia</a>
                    <a href="#" style="display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; text-decoration: none;">sustentabilidade</a>
                    <a href="#" style="display: inline-block; background: #e5e7eb; color: #374151; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; text-decoration: none;">mercado</a>
                <?php endif; ?>
            </div>
        </div>
        
    <?php endif; ?>
</aside>