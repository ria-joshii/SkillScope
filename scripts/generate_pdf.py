#!/usr/bin/env python3
import sys
import json
import datetime as dt
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.gray)
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.5 * inch, f"Page {doc.page}")
    canvas.restoreState()

def safe_get(data, *keys, default="N/A"):
    for key in keys:
        if isinstance(data, dict):
            data = data.get(key, default)
        else:
            return default
    return data if data is not None else default

def build_pdf(input_json: Path, output_pdf: Path, title: str):
    data = json.loads(input_json.read_text(encoding="utf-8"))
    styles = getSampleStyleSheet()
    
    h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=20, textColor=colors.HexColor("#CC0033"), spaceAfter=12, alignment=1, fontName="Helvetica-Bold")
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=15, textColor=colors.HexColor("#333333"), spaceAfter=10, spaceBefore=15, fontName="Helvetica-Bold")
    h3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=12, textColor=colors.HexColor("#666666"), spaceAfter=6, fontName="Helvetica-Bold")
    body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=14, spaceAfter=6)
    bullet = ParagraphStyle("Bullet", parent=body, leftIndent=20, bulletIndent=10)
    
    doc = SimpleDocTemplate(str(output_pdf), pagesize=LETTER, rightMargin=54, leftMargin=54, topMargin=64, bottomMargin=60)
    story = []
    
    # Header
    story.append(Paragraph("OSCE Evaluation Report", h1))
    story.append(Paragraph("Rutgers Robert Wood Johnson Medical School", body))
    story.append(Paragraph(f"Generated: {dt.datetime.now().strftime('%B %d, %Y at %I:%M %p')}", body))
    story.append(Spacer(1, 0.3*inch))
    
    # Aggregate Scores
    agg = data.get("aggregate_scores", {})
    critical = safe_get(agg, "critical_action_percent", default=0)
    empathy = safe_get(agg, "empathy_clarity_percent", default=0)
    passed = safe_get(agg, "passed", default=False)
    
    story.append(Paragraph("Overall Performance", h2))
    
    score_data = [
        ["Metric", "Score", "Status"],
        ["Critical Actions", f"{critical}%", "Pass" if critical >= 70 else "Fail"],
        ["Communication & Empathy", f"{empathy}%", "Pass" if empathy >= 70 else "Fail"],
        ["Overall Result", "", "PASS" if passed else "FAIL"]
    ]
    
    score_table = Table(score_data, colWidths=[3.5*inch, 1.5*inch, 1.5*inch])
    score_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#CC0033")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 11),
        ("ALIGN", (1,0), (-1,-1), "CENTER"),
        ("BACKGROUND", (0,3), (-1,3), colors.HexColor("#f0f0f0")),
        ("FONTNAME", (0,3), (-1,3), "Helvetica-Bold"),
        ("GRID", (0,0), (-1,-1), 1, colors.grey),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 10),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 0.25*inch))
    
    # Feedback Summary
    feedback = data.get("feedback_summary", {})
    story.append(Paragraph("Summary Feedback", h2))
    
    if isinstance(feedback, dict):
        overall = safe_get(feedback, "overall", default="")
        if overall:
            story.append(Paragraph(str(overall), body))
            story.append(Spacer(1, 0.15*inch))
        
        strengths = safe_get(feedback, "strengths", default=[])
        if strengths and isinstance(strengths, list):
            story.append(Paragraph("<b>Strengths:</b>", h3))
            for s in strengths:
                story.append(Paragraph(f"\u2022 {str(s)}", bullet))
            story.append(Spacer(1, 0.1*inch))
        
        areas = safe_get(feedback, "areas_for_improvement", default=[])
        if areas and isinstance(areas, list):
            story.append(Paragraph("<b>Areas for Improvement:</b>", h3))
            for a in areas:
                story.append(Paragraph(f"\u2022 {str(a)}", bullet))
            story.append(Spacer(1, 0.1*inch))
        
        summary = safe_get(feedback, "summary_comment", default="")
        if summary:
            story.append(Paragraph("<b>Summary:</b>", h3))
            story.append(Paragraph(str(summary), body))
    else:
        story.append(Paragraph(str(feedback), body))
    
    story.append(Spacer(1, 0.2*inch))
    
    # Critical Actions
    rubric = data.get("rubric_evaluation", {})
    checklist = rubric.get("critical_action_checklist", {})
    
    if checklist and isinstance(checklist, dict):
        story.append(Paragraph("Critical Action Checklist", h2))
        
        for category, items in checklist.items():
            if items and isinstance(items, list):
                story.append(Paragraph(f"<b>{category.replace('_', ' ').title()}</b>", h3))
                for item in items:
                    if isinstance(item, dict):
                        met = item.get("met", False)
                        status = "\u2713" if met else "\u2717"
                        color = "green" if met else "red"
                        evidence = str(item.get("evidence", ""))[:150]
                        comment = str(item.get("comment", ""))[:150]
                        
                        story.append(Paragraph(f"<font color='{color}'>{status}</font> {evidence}", body))
                        if comment:
                            story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;<i>{comment}</i>", body))
                story.append(Spacer(1, 0.1*inch))
    
    # Communication Assessment
    comm = rubric.get("empathy_clarity_scale", {})
    if comm and isinstance(comm, dict):
        story.append(Paragraph("Communication & Empathy Assessment", h2))
        
        for domain, items in comm.items():
            if items and isinstance(items, list):
                story.append(Paragraph(f"<b>{domain.replace('_', ' ').title()}</b>", h3))
                for item in items:
                    if isinstance(item, dict):
                        met = item.get("met", False)
                        status = "\u2713" if met else "\u2717"
                        color = "green" if met else "red"
                        criterion = str(item.get("criterion", ""))
                        evidence = str(item.get("evidence", ""))[:150]
                        
                        story.append(Paragraph(f"<font color='{color}'>{status}</font> {criterion}", body))
                        if evidence:
                            story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;<i>{evidence}</i>", body))
                story.append(Spacer(1, 0.1*inch))
    
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    
    input_json = Path(sys.argv[1])
    output_pdf = Path(sys.argv[2])
    title = sys.argv[3] if len(sys.argv) > 3 else "OSCE Evaluation Report"
    
    build_pdf(input_json, output_pdf, title)
    print(str(output_pdf))
