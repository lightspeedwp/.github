#!/usr/bin/env ruby

require 'date'
require 'yaml'

def frontmatter(path)
  txt = File.read(path)
  return nil unless txt.start_with?("---\n")

  parts = txt.split(/^---\s*$/, 3)
  yaml = parts[1]
  YAML.safe_load(yaml, permitted_classes: [Date, Time], aliases: true)
rescue StandardError => e
  { '__error' => e.message }
end

files = Dir['agents/*.agent.md'].sort
baseline = frontmatter('agents/release.agent.md') || {}
base_tools = Array(baseline['tools']).map(&:to_s)
base_perms = Array(baseline['permissions']).map(&:to_s)

puts 'BASELINE: release.agent.md'
puts "tools(#{base_tools.size}): #{base_tools.join(', ')}"
puts "permissions(#{base_perms.size}): #{base_perms.join(', ')}"
puts "\nAGENT AUDIT"

files.each do |f|
  fm = frontmatter(f)
  if fm.nil?
    puts "\n#{f}: ERROR no frontmatter"
    next
  end

  if fm['__error']
    puts "\n#{f}: ERROR parsing frontmatter: #{fm['__error']}"
    next
  end

  tools = Array(fm['tools']).map(&:to_s)
  perms = Array(fm['permissions']).map(&:to_s)
  miss_t = base_tools - tools
  miss_p = base_perms - perms
  extra_t = tools - base_tools
  extra_p = perms - base_perms

  puts "\n#{f}"
  puts "  tools_present=#{fm.key?('tools')} count=#{tools.size}"
  puts "  permissions_present=#{fm.key?('permissions')} count=#{perms.size}"
  puts "  missing_tools(#{miss_t.size}): #{miss_t.join(', ')}" unless miss_t.empty?
  puts "  missing_permissions(#{miss_p.size}): #{miss_p.join(', ')}" unless miss_p.empty?
  puts "  extra_tools(#{extra_t.size}): #{extra_t.join(', ')}" unless extra_t.empty?
  puts "  extra_permissions(#{extra_p.size}): #{extra_p.join(', ')}" unless extra_p.empty?
  puts "  status: #{miss_t.empty? && miss_p.empty? ? 'MATCH_BASELINE' : 'GAP'}"
end
