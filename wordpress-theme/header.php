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
        <!-- Top bar -->
        <div class="header-top">
            <div class="container">
                <div class="header-tagline">
                    Portal Global do Mercado de Alumínio
                </div>
                <div class="header-actions">
                    <a href="#">Newsletter</a>
                    <a href="#">Anuncie Conosco</a>
                </div>
            </div>
        </div>

        <!-- Main header -->
        <div class="header-main">
            <div class="container">
                <!-- Logo -->
                <div class="site-logo">
                    <a href="<?php echo home_url(); ?>">
                        <?php if (function_exists('the_custom_logo') && has_custom_logo()) : ?>
                            <?php the_custom_logo(); ?>
                        <?php else : ?>
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/logo.png" alt="<?php bloginfo('name'); ?>">
                        <?php endif; ?>
                    </a>
                </div>

                <!-- Search Bar -->
                <form class="search-form" role="search" method="get" action="<?php echo home_url('/'); ?>">
                    <span class="search-icon">🔍</span>
                    <input type="search" name="s" placeholder="Buscar no portal..." value="<?php echo get_search_query(); ?>">
                    <button type="submit" class="search-btn">Buscar</button>
                </form>
            </div>
        </div>
    </header>
    
    <!-- Navigation Menu -->
    <nav class="site-navigation">
        <div class="container">
            <div class="nav-container">
                <div class="main-navigation">
                    <?php
                    $nav_items = array(
                        array('label' => 'Início', 'url' => home_url('/'), 'icon' => '🏠'),
                        array('label' => 'Notícias', 'url' => home_url('/noticias'), 'icon' => '📰'),
                        array('label' => 'Materiais Técnicos', 'url' => home_url('/materiais'), 'icon' => '📄'),
                        array('label' => 'E-books', 'url' => home_url('/ebooks'), 'icon' => '📚'),
                        array('label' => 'Fornecedores', 'url' => home_url('/fornecedores'), 'icon' => '👥'),
                        array('label' => 'Fundições', 'url' => home_url('/fundicoes'), 'icon' => '🏭'),
                    );
                    
                    foreach ($nav_items as $item) :
                        $is_active = (($_SERVER['REQUEST_URI'] == parse_url($item['url'], PHP_URL_PATH)) || 
                                     (is_home() && $item['url'] == home_url('/')));
                    ?>
                        <a href="<?php echo $item['url']; ?>" 
                           class="nav-item <?php echo $is_active ? 'active' : ''; ?>">
                            <span class="nav-icon"><?php echo $item['icon']; ?></span>
                            <span><?php echo $item['label']; ?></span>
                        </a>
                    <?php endforeach; ?>
                </div>

                <div class="header-actions">
                    <a href="#" class="nav-item">
                        Mais Categorias
                        <span>⌄</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>