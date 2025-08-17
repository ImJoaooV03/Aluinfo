    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-section">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <?php if (function_exists('the_custom_logo') && has_custom_logo()) : ?>
                        <?php the_custom_logo(); ?>
                    <?php else : ?>
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/logo.png" alt="<?php bloginfo('name'); ?>" style="height: 48px; width: auto; margin-bottom: 1rem;">
                    <?php endif; ?>
                </div>
                <p style="text-align: center; font-size: 0.875rem; margin-bottom: 1.5rem;">
                    O portal global que conecta toda a cadeia produtiva do alumínio. Fornecedores, fundições, compradores e profissionais unidos em uma só plataforma.
                </p>
            </div>
            
            <div class="footer-section">
                <h3>Navegação</h3>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer-menu',
                    'menu_class' => 'footer-menu',
                    'fallback_cb' => 'aluinfo_footer_fallback_menu',
                    'container' => false,
                ));
                ?>
            </div>
            
            <div class="footer-section">
                <h3>Categorias</h3>
                <ul>
                    <?php
                    $categories = get_categories(array('number' => 5));
                    foreach($categories as $category) :
                    ?>
                        <li><a href="<?php echo get_category_link($category->term_id); ?>"><?php echo $category->name; ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Contato</h3>
                <ul>
                    <li>📧 contato@aluinfo.com.br</li>
                    <li>📱 (11) 9999-9999</li>
                    <li>📍 São Paulo, SP</li>
                </ul>
                
                <div style="margin-top: 1rem;">
                    <h4 style="margin-bottom: 0.5rem;">Redes Sociais</h4>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#" style="color: #3b82f6;">LinkedIn</a>
                        <a href="#" style="color: #3b82f6;">Facebook</a>
                        <a href="#" style="color: #3b82f6;">Instagram</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. Todos os direitos reservados.</p>
        </div>
    </footer>
    
    <?php wp_footer(); ?>
</body>
</html>