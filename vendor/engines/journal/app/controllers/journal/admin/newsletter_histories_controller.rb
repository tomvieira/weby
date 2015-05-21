module Journal::Admin
  class NewsletterHistoriesController < Journal::ApplicationController
    def index
      @newsletterlist = get_news
    end

    def pdf
      comp = Weby::Components.factory(current_site.components.find_by_name("newsletter"))
      newsletterlist = get_news
      Prawn::Document.generate("public/newsletter.pdf") do |pdf|
        if !comp.report_logo.empty? && !comp.position_logo.empty?
          logo = @site.url+Repository.find(comp.report_logo).archive.url(:o, timestamp: false)
          pdf.image open(logo), :at => [comp.position_logo == 'left' ? 10 : 425, 730]
        end
        pdf.text comp.report_title, size: 16, align: :center, style: :bold
        pdf.text comp.report_subtitle, size: 16, align: :center
        pdf.text "  ", size: 20
        pdf.text @dt_start+" - "+@dt_end,
            size: 12, align: :center
        table_data = [["<b>"+t(".title")+"</b>","<b>"+t(".user")+"</b>",
                       "<b>"+t(".sent_by")+"</b>","<b>"+t(".date_sent")+"</b>","<b>"+t(".qtty")+"</b>"]]
        newsletterlist.each do |newsletter|
          table_data.insert(table_data.length,
                           [newsletter.news.title,newsletter.news.user.first_name,newsletter.user.first_name,
                           l(newsletter.created_at, format: :short).to_s,newsletter.emails.split(',').count.to_s])
        end
        pdf.table(table_data, width: 550, cell_style: { inline_format: true, size: 10 })
      end
      send_file "public/newsletter.pdf", type: "application/pdf", x_sendfile: true
    end

    def csv
      comp = Weby::Components.factory(current_site.components.find_by_name("newsletter"))
      newsletterlist = get_news
      File.open("public/newsletter.csv", 'w') do |arquivo|
        arquivo.puts comp.report_title
        arquivo.puts comp.report_subtitle
        arquivo.puts
        arquivo.puts @dt_start+" - "+@dt_end
        arquivo.puts t(".title")+","+t(".user")+","+t(".sent_by")+","+t(".date_sent")+","+t(".qtty")
        newsletterlist = get_news
        newsletterlist.each do |newsletter|
          arquivo.puts newsletter.news.title+","+newsletter.news.user.first_name+","+newsletter.user.first_name+","+
                       l(newsletter.created_at, :format => :short).to_s+","+newsletter.emails.split(',').count.to_s
        end
      end
     send_file "public/newsletter.csv", type: "application/txt", x_sendfile: true
    end

    def get_news
      range = params[:dt_range].nil? || params[:dt_range].empty? ? (Date.today-30).strftime("%d/%m/%Y")+"  -  "+(Date.today).strftime("%d/%m/%Y") : params[:dt_range].to_s
      if range.match(/\d{2}\/\d{2}\/\d{4}\s{2}\-\s{2}\d{2}\/\d{2}\/\d{4}/).nil?
        flash.now[:alert] = t(".invalid_date")
        []
      else
        dt = range.split(" ")
        @dt_start = dt[0]
        @dt_end = dt[2]
        Journal::NewsletterHistories.get_by_date(current_site.id, @dt_start, @dt_end)
      end
    end
  end
end
