<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="<?php bloginfo('description'); ?>">
    <meta name="keywords" content="alumínio, fundição, fornecedores, indústria, metalurgia">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?>">
    <meta property="og:description" content="<?php bloginfo('description'); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo home_url(); ?>">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <header class="site-header">
        <div class="header-container">
            <div class="site-logo">
                <a href="<?php echo home_url(); ?>">
                    <?php if (function_exists('the_custom_logo') && has_custom_logo()) : ?>
                        <?php the_custom_logo(); ?>
                    <?php else : ?>
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/logo.png" alt="<?php bloginfo('name'); ?>">
                    <?php endif; ?>
                </a>
            </div>
            
            <nav class="main-navigation">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'main-menu',
                    'menu_class' => 'main-menu',
                    'fallback_cb' => 'aluinfo_fallback_menu',
                ));
                ?>
            </nav>
            
            <div class="header-actions">
                <a href="#" class="btn btn-secondary">Login</a>
                <a href="#" class="btn btn-primary">Cadastrar</a>
            </div>
        </div>
    </header>
    
    <!-- Navigation Menu -->
    <nav class="secondary-navigation" style="background: #374151; padding: 0.5rem 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'secondary-menu',
                'menu_class' => 'secondary-menu',
                'fallback_cb' => 'aluinfo_secondary_fallback_menu',
                'container' => false,
            ));
            ?>
        </div>
    </nav>