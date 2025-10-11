#!/usr/bin/env python3
import sys
import re
import datetime as dt
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, XPreformatted, Table, TableStyle

EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001F5FF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U0001F700-\U0001F77F"
    "\U0001F780-\U0001F7FF"
    "\U0001F800-\U0001F8FF"
    "\U0001F900-\U0001F9FF"
    "\U0001FA00-\U0001FAFF"
    "\U00002702-\U000027B0"
    "\U000024C2-\U0001F251"
    "]+",
    flags=re.UNICODE,
)

def strip_emojis(text: str) -> str:
    text = EMOJI_PATTERN.sub("", text)
    text = re.sub(r"[^\S\n\t\r ]+", "", text)
    return text

def looks_like_transcript_line(line: str) -> bool:
    return bool(re.match(r"^\[\d{2}:\d{2}:\d{2}(?:[,\.]\d{3})?\s*-->\s*\d{2}:\d{2}:\d{2}(?:[,\.]\d{3})?\]\s+\w+", line))

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("HeiseiMin-W3", 9)
    canvas.setFillColor(colors.gray)
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.5 * inch, f"Page {doc.page}")
    canvas.restoreState()

def build_pdf(input_txt: Path, output_pdf: Path, title: str):
    pdfmetrics.registerFont(UnicodeCIDFont("HeiseiMin-W3"))
    styles = getSampleStyleSheet()
    
    base = ParagraphStyle("Base", parent=styles["Normal"], fontName="HeiseiMin-W3", fontSize=10.5, leading=14, spaceAfter=6, textColor=colors.black)
    h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontName="HeiseiMin-W3", fontSize=16, leading=20, textColor=colors.HexColor("#CC0033"), spaceAfter=10)
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontName="HeiseiMin-W3", fontSize=12.5, leading=16, textColor=colors.HexColor("#333333"), spaceAfter=6)
    mono = ParagraphStyle("Mono", parent=base, fontName="HeiseiMin-W3", leading=14)

    doc = SimpleDocTemplate(str(output_pdf), pagesize=LETTER, rightMargin=54, leftMargin=54, topMargin=64, bottomMargin=60, title=title, author="OSCE Pipeline")
    
    raw = input_txt.read_text(encoding="utf-8", errors="ignore")
    clean = strip_emojis(raw)
    story = []
    
    story.append(Paragraph(title, h1))
    meta_table = Table([["Source file:", str(input_txt.name)], ["Generated:", dt.datetime.now().strftime("%Y-%m-%d %H:%M")]], colWidths=[1.4*inch, 4.8*inch])
    meta_table.setStyle(TableStyle([("FONTNAME", (0,0), (-1,-1), "HeiseiMin-W3"), ("FONTSIZE", (0,0), (-1,-1), 9.5), ("TEXTCOLOR", (0,0), (0,-1), colors.HexColor("#666666")), ("BOTTOMPADDING", (0,0), (-1,-1), 4)]))
    story.append(meta_table)
    story.append(Spacer(1, 0.2*inch))

    lines = clean.splitlines()
    transcriptish = sum(looks_like_transcript_line(l) for l in lines) >= max(10, int(0.2 * len(lines)))
    
    if transcriptish:
        story.append(Paragraph("Transcript", h2))
        chunk, char_count = [], 0
        for line in lines:
            chunk.append(line)
            char_count += len(line)
            if char_count > 5000:
                story.append(XPreformatted("\n".join(chunk), mono))
                story.append(Spacer(1, 0.12*inch))
                chunk, char_count = [], 0
        if chunk:
            story.append(XPreformatted("\n".join(chunk), mono))
    else:
        story.append(Paragraph("Content", h2))
        paragraphs = re.split(r"\n\s*\n", clean.strip())
        for p in paragraphs:
            p = p.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            story.append(Paragraph(p.replace("\n", "<br/>"), base))
            story.append(Spacer(1, 0.06*inch))

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    
    input_txt = Path(sys.argv[1])
    output_pdf = Path(sys.argv[2])
    title = sys.argv[3] if len(sys.argv) > 3 else "OSCE Evaluation Report"
    
    build_pdf(input_txt, output_pdf, title)
    print(str(output_pdf))
