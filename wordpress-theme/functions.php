<?php
/**
 * Funções do tema ALUINFO
 */

// Suporte a recursos do tema
function aluinfo_theme_setup() {
    // Suporte a menus
    add_theme_support('menus');
    
    // Suporte a imagens destacadas
    add_theme_support('post-thumbnails');
    
    // Suporte a logo customizado
    add_theme_support('custom-logo', array(
        'height'      => 40,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Suporte a título dinâmico
    add_theme_support('title-tag');
    
    // Suporte a HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Registrar tamanhos de imagem
    add_image_size('news-thumb', 300, 200, true);
    add_image_size('news-large', 800, 400, true);
}
add_action('after_setup_theme', 'aluinfo_theme_setup');

// Registrar menus
function aluinfo_register_menus() {
    register_nav_menus(array(
        'main-menu' => 'Menu Principal',
        'secondary-menu' => 'Menu Secundário',
        'footer-menu' => 'Menu do Rodapé',
    ));
}
add_action('init', 'aluinfo_register_menus');

// Registrar sidebar
function aluinfo_register_sidebars() {
    register_sidebar(array(
        'name'          => 'Sidebar Principal',
        'id'            => 'main-sidebar',
        'description'   => 'Sidebar que aparece nas páginas principais',
        'before_widget' => '<div class="widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>',
    ));
    
    register_sidebar(array(
        'name'          => 'Footer Widget 1',
        'id'            => 'footer-1',
        'description'   => 'Primeira coluna do rodapé',
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'aluinfo_register_sidebars');

// Enfileirar estilos e scripts
function aluinfo_enqueue_scripts() {
    // CSS principal
    wp_enqueue_style('aluinfo-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));
    
    // JavaScript (se necessário)
    wp_enqueue_script('aluinfo-script', get_template_directory_uri() . '/js/main.js', array('jquery'), wp_get_theme()->get('Version'), true);
}
add_action('wp_enqueue_scripts', 'aluinfo_enqueue_scripts');

// Menu fallback para o menu principal
function aluinfo_fallback_menu() {
    echo '<ul class="main-menu">';
    echo '<li><a href="' . home_url() . '">Início</a></li>';
    echo '<li><a href="' . home_url() . '/noticias">Notícias</a></li>';
    echo '<li><a href="' . home_url() . '/fundicoes">Fundições</a></li>';
    echo '<li><a href="' . home_url() . '/fornecedores">Fornecedores</a></li>';
    echo '<li><a href="' . home_url() . '/materiais-tecnicos">Materiais Técnicos</a></li>';
    echo '<li><a href="' . home_url() . '/ebooks">E-books</a></li>';
    echo '</ul>';
}

// Menu fallback para o menu secundário
function aluinfo_secondary_fallback_menu() {
    echo '<ul class="secondary-menu" style="list-style: none; display: flex; gap: 2rem; color: white;">';
    echo '<li><a href="' . home_url() . '/categoria/mercado" style="color: #d1d5db; text-decoration: none;">Mercado</a></li>';
    echo '<li><a href="' . home_url() . '/categoria/tecnologia" style="color: #d1d5db; text-decoration: none;">Tecnologia</a></li>';
    echo '<li><a href="' . home_url() . '/categoria/sustentabilidade" style="color: #d1d5db; text-decoration: none;">Sustentabilidade</a></li>';
    echo '<li><a href="' . home_url() . '/categoria/inovacao" style="color: #d1d5db; text-decoration: none;">Inovação</a></li>';
    echo '</ul>';
}

// Menu fallback para o rodapé
function aluinfo_footer_fallback_menu() {
    echo '<ul>';
    echo '<li><a href="' . home_url() . '">Início</a></li>';
    echo '<li><a href="' . home_url() . '/sobre">Sobre</a></li>';
    echo '<li><a href="' . home_url() . '/contato">Contato</a></li>';
    echo '<li><a href="' . home_url() . '/politica-privacidade">Política de Privacidade</a></li>';
    echo '</ul>';
}

// Customizar excerpt
function aluinfo_custom_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'aluinfo_custom_excerpt_length');

function aluinfo_custom_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'aluinfo_custom_excerpt_more');

// Adicionar meta box para campos customizados
function aluinfo_add_meta_boxes() {
    add_meta_box(
        'news-meta',
        'Informações da Notícia',
        'aluinfo_news_meta_callback',
        'post',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'aluinfo_add_meta_boxes');

function aluinfo_news_meta_callback($post) {
    wp_nonce_field('aluinfo_save_meta', 'aluinfo_meta_nonce');
    
    $views = get_post_meta($post->ID, 'news_views', true);
    $featured = get_post_meta($post->ID, 'news_featured', true);
    
    echo '<table>';
    echo '<tr><td><label for="news_views">Visualizações:</label></td><td><input type="number" id="news_views" name="news_views" value="' . esc_attr($views) . '" /></td></tr>';
    echo '<tr><td><label for="news_featured">Notícia em Destaque:</label></td><td><input type="checkbox" id="news_featured" name="news_featured" value="1" ' . checked($featured, 1, false) . ' /></td></tr>';
    echo '</table>';
}

function aluinfo_save_meta($post_id) {
    if (!isset($_POST['aluinfo_meta_nonce']) || !wp_verify_nonce($_POST['aluinfo_meta_nonce'], 'aluinfo_save_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['news_views'])) {
        update_post_meta($post_id, 'news_views', sanitize_text_field($_POST['news_views']));
    }
    
    if (isset($_POST['news_featured'])) {
        update_post_meta($post_id, 'news_featured', 1);
    } else {
        update_post_meta($post_id, 'news_featured', 0);
    }
}
add_action('save_post', 'aluinfo_save_meta');

// Função para incrementar visualizações
function aluinfo_increment_views($post_id) {
    if (is_single()) {
        $views = get_post_meta($post_id, 'news_views', true);
        $views = $views ? $views + 1 : 1;
        update_post_meta($post_id, 'news_views', $views);
    }
}
add_action('wp_head', function() {
    if (is_single()) {
        global $post;
        aluinfo_increment_views($post->ID);
    }
});

// Adicionar suporte a posts type customizados (se necessário)
function aluinfo_register_post_types() {
    // Exemplo: Fornecedores
    register_post_type('fornecedores', array(
        'labels' => array(
            'name' => 'Fornecedores',
            'singular_name' => 'Fornecedor',
        ),
        'public' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-store',
    ));
    
    // Exemplo: Fundições
    register_post_type('fundicoes', array(
        'labels' => array(
            'name' => 'Fundições',
            'singular_name' => 'Fundição',
        ),
        'public' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-building',
    ));
}
add_action('init', 'aluinfo_register_post_types');

?>