class PopularController < ApplicationController
  include Authorization
  layout 'public'

  EXCLUDED_ACCOUNT_IDS = ENV['EXCLUDED_ACCOUNT_IDS'] || [-1]
  def index
    authorize :popular, :index?
    @popular = Status.
                local.
                with_public_visibility.
                where('reblogs_count + favourites_count > ?', threshold).
                where(%q(created_at > NOW() - INTERVAL '7 days')).
                limit(100).
                reverse[0...25]
    @page = page
  end

  protected

  def threshold
    base = Status.local.with_public_visibility.where('account_id not in (?)', EXCLUDED_ACCOUNT_IDS).where('favourites_count > 1 or reblogs_count > 1').where(%q(created_at > NOW() - INTERVAL '30 days'))
    favorites = base.average('statuses.favourites_count') || 0
    reblogs = base.average('statuses.reblogs_count') || 0
    favorites + reblogs
  end

  def page
    (params[:page].presence || 1).to_i
  end

end
