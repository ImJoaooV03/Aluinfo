    <footer class="site-footer">
        <!-- Main footer content -->
        <div class="footer-content">
            <div class="container">
                <div class="footer-grid">
                    <!-- Company info -->
                    <div class="footer-company">
                        <?php if (function_exists('the_custom_logo') && has_custom_logo()) : ?>
                            <?php the_custom_logo(); ?>
                        <?php else : ?>
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/logo.png" 
                                 alt="<?php bloginfo('name'); ?>" 
                                 class="footer-logo">
                        <?php endif; ?>
                        
                        <p class="footer-description">
                            O portal global que conecta toda a cadeia produtiva do alumínio. Fornecedores, fundições, compradores e profissionais unidos em uma só plataforma.
                        </p>
                        
                        <div class="footer-contact">
                            <div class="contact-item">
                                <span class="contact-icon">✉</span>
                                contato@aluinfo.com.br
                            </div>
                            <div class="contact-item">
                                <span class="contact-icon">📱</span>
                                +55 11 3000-0000
                            </div>
                            <div class="contact-item">
                                <span class="contact-icon">📍</span>
                                São Paulo, Brasil
                            </div>
                        </div>
                    </div>

                    <!-- Portal -->
                    <div class="footer-section">
                        <h3>Portal</h3>
                        <ul>
                            <li><a href="#">Sobre Nós</a></li>
                            <li><a href="#">Como Funciona</a></li>
                            <li><a href="#">Contato</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>

                    <!-- Serviços -->
                    <div class="footer-section">
                        <h3>Serviços</h3>
                        <ul>
                            <li><a href="/fornecedores">Guia de Fornecedores</a></li>
                            <li><a href="/fundicoes">Guia de Fundições</a></li>
                            <li><a href="/materiais">Materiais Técnicos</a></li>
                            <li><a href="#">Anuncie Conosco</a></li>
                        </ul>
                    </div>

                    <!-- Educação -->
                    <div class="footer-section">
                        <h3>Educação</h3>
                        <ul>
                            <li><a href="#">Cursos Online</a></li>
                            <li><a href="/ebooks">Ebooks</a></li>
                            <li><a href="#">Certificações</a></li>
                            <li><a href="#">Webinars</a></li>
                        </ul>
                    </div>

                    <!-- Mercado -->
                    <div class="footer-section">
                        <h3>Mercado</h3>
                        <ul>
                            <li><a href="/noticias">Notícias</a></li>
                            <li><a href="#">Análises</a></li>
                            <li><a href="#">Cotações</a></li>
                            <li><a href="#">Relatórios</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Newsletter section -->
        <div class="newsletter-section">
            <div class="container">
                <div class="newsletter-content">
                    <div class="newsletter-info">
                        <h3>Mantenha-se Atualizado</h3>
                        <p>Receba as principais notícias do setor diretamente no seu email</p>
                    </div>
                    <button class="newsletter-btn">
                        Assinar Newsletter
                    </button>
                </div>
            </div>
        </div>

        <!-- Bottom footer -->
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <div class="footer-copyright">
                        © <?php echo date('Y'); ?> ALUINFO. Todos os direitos reservados. •
                        <a href="#">Termos de Uso</a> •
                        <a href="#">Política de Privacidade</a>
                    </div>
                    <div class="social-links">
                        <a href="#" class="social-link">
                            <span class="social-icon">📘</span>
                        </a>
                        <a href="#" class="social-link">
                            <span class="social-icon">🐦</span>
                        </a>
                        <a href="#" class="social-link">
                            <span class="social-icon">💼</span>
                        </a>
                        <a href="#" class="social-link">
                            <span class="social-icon">📺</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    
    <?php wp_footer(); ?>
</body>
</html>