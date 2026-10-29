#!/bin/bash
# studio-site-manager.sh — Interactive WordPress Studio site manager
# Provides menu-driven interface for common site management tasks
# Usage: ./studio-site-manager.sh [site-path]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_PATH="${1:-.}"

# Source the library
if [ ! -f "$SCRIPT_DIR/lib-studio.sh" ]; then
    echo "❌ Error: lib-studio.sh not found in $SCRIPT_DIR"
    exit 1
fi

source "$SCRIPT_DIR/lib-studio.sh"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN MENU
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

show_main_menu() {
    echo ""
    echo -e "${CYAN}WordPress Studio Site Manager${NC}"
    echo -e "${CYAN}════════════════════════════════${NC}"
    echo ""
    echo "Choose an action:"
    echo ""
    echo "  ${BLUE}Site Information${NC}"
    echo "    1) Show site details"
    echo "    2) Show site configuration"
    echo "    3) List all sites"
    echo ""
    echo "  ${BLUE}Server Management${NC}"
    echo "    4) Start server"
    echo "    5) Stop server"
    echo "    6) Show server status"
    echo ""
    echo "  ${BLUE}Database Operations${NC}"
    echo "    7) Backup database"
    echo "    8) Export database"
    echo "    9) Import database"
    echo "    10) Replace URLs"
    echo "    11) Show table row counts"
    echo ""
    echo "  ${BLUE}Plugin Management${NC}"
    echo "    12) List plugins"
    echo "    13) Activate plugin"
    echo "    14) Deactivate plugin"
    echo ""
    echo "  ${BLUE}Theme Management${NC}"
    echo "    15) List themes"
    echo "    16) Activate theme"
    echo ""
    echo "  ${BLUE}Site Configuration${NC}"
    echo "    17) Set WordPress version"
    echo "    18) Set PHP version"
    echo ""
    echo "  ${BLUE}Site Management${NC}"
    echo "    19) Create new site"
    echo "    20) Delete site"
    echo ""
    echo "  ${BLUE}Export/Import${NC}"
    echo "    21) Export entire site"
    echo "    22) Import entire site"
    echo ""
    echo "  ${GRAY}0) Exit${NC}"
    echo ""
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MENU HANDLERS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

handle_show_site_details() {
    log_section "Site Details"
    studio_get_site_info "$SITE_PATH"
    press_enter_to_continue
}

handle_show_config() {
    log_section "Site Configuration"
    studio_get_config "$SITE_PATH"
    press_enter_to_continue
}

handle_list_all_sites() {
    log_section "All Studio Sites"
    studio_list_sites
    press_enter_to_continue
}

handle_start_server() {
    log_section "Start Server"
    studio_start_server "$SITE_PATH"
    press_enter_to_continue
}

handle_stop_server() {
    log_section "Stop Server"
    studio_stop_server "$SITE_PATH"
    press_enter_to_continue
}

handle_server_status() {
    log_section "Server Status"
    studio_server_status "$SITE_PATH"
    press_enter_to_continue
}

handle_backup_database() {
    log_section "Backup Database"
    read -p "Enter backup filename (default: backup-TIMESTAMP.sql): " backup_file
    backup_file="${backup_file:-backup-$(date +%Y%m%d-%H%M%S).sql}"
    studio_backup_database "$SITE_PATH" "$backup_file"
    press_enter_to_continue
}

handle_export_database() {
    log_section "Export Database"
    read -p "Enter export filename (default: export-TIMESTAMP.sql): " export_file
    export_file="${export_file:-export-$(date +%Y%m%d-%H%M%S).sql}"
    studio_export_database "$SITE_PATH" "$export_file"
    press_enter_to_continue
}

handle_import_database() {
    log_section "Import Database"
    read -p "Enter path to backup file: " backup_file

    if [ -z "$backup_file" ]; then
        log_error "No file provided"
        press_enter_to_continue
        return 1
    fi

    studio_import_database "$backup_file" "$SITE_PATH"
    press_enter_to_continue
}

handle_replace_urls() {
    log_section "Replace URLs"

    local current_url
    current_url=$(studio_get_site_url "$SITE_PATH" 2>/dev/null || echo "unknown")

    log_info "Current site URL: $current_url"

    read -p "Enter old URL (current site URL): " old_url
    read -p "Enter new URL (local URL): " new_url

    if [ -z "$old_url" ] || [ -z "$new_url" ]; then
        log_error "Both URLs must be provided"
        press_enter_to_continue
        return 1
    fi

    studio_replace_urls "$SITE_PATH" "$old_url" "$new_url"
    press_enter_to_continue
}

handle_show_table_counts() {
    log_section "Database Table Row Counts"
    studio_get_table_counts "$SITE_PATH"
    press_enter_to_continue
}

handle_list_plugins() {
    log_section "Installed Plugins"
    studio_list_plugins "$SITE_PATH"
    press_enter_to_continue
}

handle_activate_plugin() {
    log_section "Activate Plugin"
    read -p "Enter plugin slug (e.g., hello-dolly): " plugin

    if [ -z "$plugin" ]; then
        log_error "No plugin specified"
        press_enter_to_continue
        return 1
    fi

    studio_activate_plugin "$plugin" "$SITE_PATH"
    press_enter_to_continue
}

handle_deactivate_plugin() {
    log_section "Deactivate Plugin"
    read -p "Enter plugin slug (e.g., hello-dolly): " plugin

    if [ -z "$plugin" ]; then
        log_error "No plugin specified"
        press_enter_to_continue
        return 1
    fi

    studio_deactivate_plugin "$plugin" "$SITE_PATH"
    press_enter_to_continue
}

handle_list_themes() {
    log_section "Installed Themes"
    studio_list_themes "$SITE_PATH"
    press_enter_to_continue
}

handle_activate_theme() {
    log_section "Activate Theme"
    read -p "Enter theme slug (e.g., twentytwentyfour): " theme

    if [ -z "$theme" ]; then
        log_error "No theme specified"
        press_enter_to_continue
        return 1
    fi

    studio_activate_theme "$theme" "$SITE_PATH"
    press_enter_to_continue
}

handle_set_wp_version() {
    log_section "Set WordPress Version"

    local current_version
    current_version=$(studio_get_wp_version "$SITE_PATH" 2>/dev/null || echo "unknown")
    log_info "Current WordPress version: $current_version"

    read -p "Enter new WordPress version (e.g., 6.4.3): " version

    if [ -z "$version" ]; then
        log_error "No version provided"
        press_enter_to_continue
        return 1
    fi

    studio_set_wp_version "$version" "$SITE_PATH"
    press_enter_to_continue
}

handle_set_php_version() {
    log_section "Set PHP Version"
    read -p "Enter PHP version (e.g., 8.2): " version

    if [ -z "$version" ]; then
        log_error "No version provided"
        press_enter_to_continue
        return 1
    fi

    studio_set_php_version "$version" "$SITE_PATH"
    press_enter_to_continue
}

handle_create_site() {
    log_section "Create New Site"
    read -p "Enter site name: " site_name
    read -p "Enter site path (default: ~/Studio/$site_name): " site_path
    read -p "Enter domain (default: $site_name.local): " domain

    site_path="${site_path:-$HOME/Studio/$site_name}"
    domain="${domain:-$site_name.local}"

    studio_create_site "$site_name" "$site_path" "$domain"

    log_info "New site created at: $site_path"
    log_info "To manage this site, run: ./studio-site-manager.sh '$site_path'"

    press_enter_to_continue
}

handle_delete_site() {
    log_section "Delete Site"

    read -p "Also delete files? (y/N): " delete_files
    delete_files_flag="false"
    if [[ "$delete_files" =~ ^[Yy]$ ]]; then
        delete_files_flag="true"
    fi

    studio_delete_site "$SITE_PATH" "$delete_files_flag"
    press_enter_to_continue
}

handle_export_site() {
    log_section "Export Entire Site"
    read -p "Enter export filename (default: site-export-TIMESTAMP.zip): " export_file
    export_file="${export_file:-site-export-$(date +%Y%m%d-%H%M%S).zip}"
    studio_export_site "$SITE_PATH" "$export_file"
    press_enter_to_continue
}

handle_import_site() {
    log_section "Import Entire Site"
    read -p "Enter path to backup file (.zip or .sql): " backup_file

    if [ -z "$backup_file" ]; then
        log_error "No file provided"
        press_enter_to_continue
        return 1
    fi

    studio_import_site "$backup_file" "$SITE_PATH"
    press_enter_to_continue
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# UTILITY FUNCTIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

press_enter_to_continue() {
    echo ""
    read -p "Press Enter to continue..."
}

clear_screen() {
    clear || printf '\033[2J\033[H'
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN LOOP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

main() {
    # Check dependencies
    if ! check_studio_available; then
        exit 1
    fi

    # Validate site path if not interactive mode
    if [ "$SITE_PATH" != "." ] && ! validate_site_path "$SITE_PATH" 2>/dev/null; then
        log_warning "Site path not valid yet: $SITE_PATH"
        log_info "You can create a new site from the menu"
    fi

    local choice

    while true; do
        clear_screen

        if [ "$SITE_PATH" != "." ]; then
            echo -e "${CYAN}Site: $SITE_PATH${NC}"
        fi

        show_main_menu
        read -p "Enter your choice [0-22]: " choice

        case "$choice" in
            1) handle_show_site_details ;;
            2) handle_show_config ;;
            3) handle_list_all_sites ;;
            4) handle_start_server ;;
            5) handle_stop_server ;;
            6) handle_server_status ;;
            7) handle_backup_database ;;
            8) handle_export_database ;;
            9) handle_import_database ;;
            10) handle_replace_urls ;;
            11) handle_show_table_counts ;;
            12) handle_list_plugins ;;
            13) handle_activate_plugin ;;
            14) handle_deactivate_plugin ;;
            15) handle_list_themes ;;
            16) handle_activate_theme ;;
            17) handle_set_wp_version ;;
            18) handle_set_php_version ;;
            19) handle_create_site ;;
            20) handle_delete_site ;;
            21) handle_export_site ;;
            22) handle_import_site ;;
            0)
                log_info "Goodbye!"
                exit 0
                ;;
            *)
                log_error "Invalid choice"
                sleep 1
                ;;
        esac
    done
}

# Run main loop
main "$@"
