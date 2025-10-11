#!/usr/bin/env python3
import sys
import json
import datetime as dt
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.gray)
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.5 * inch, f"Page {doc.page}")
    canvas.restoreState()

def build_pdf(input_json: Path, output_pdf: Path, title: str):
    data = json.loads(input_json.read_text(encoding="utf-8"))
    styles = getSampleStyleSheet()
    
    h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=18, textColor=colors.HexColor("#CC0033"), spaceAfter=12, alignment=1)
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=14, textColor=colors.HexColor("#333333"), spaceAfter=8, spaceBefore=12)
    body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=14, spaceAfter=6)
    
    doc = SimpleDocTemplate(str(output_pdf), pagesize=LETTER, rightMargin=54, leftMargin=54, topMargin=64, bottomMargin=60)
    story = []
    
    # Header
    story.append(Paragraph("OSCE Evaluation Report", h1))
    story.append(Paragraph(f"Rutgers Robert Wood Johnson Medical School", body))
    story.append(Paragraph(f"Generated: {dt.datetime.now().strftime('%B %d, %Y at %I:%M %p')}", body))
    story.append(Spacer(1, 0.3*inch))
    
    # Aggregate Scores
    agg = data.get("aggregate_scores", {})
    story.append(Paragraph("Overall Performance", h2))
    
    score_data = [
        ["Metric", "Score", "Status"],
        ["Critical Actions Checklist", f"{agg.get('checklist_percent', 0)}%", "Pass" if agg.get('checklist_percent', 0) >= 70 else "Fail"],
        ["Communication & Empathy", f"{agg.get('communication_percent', 0)}%", "Pass" if agg.get('communication_percent', 0) >= 70 else "Fail"],
        ["Clinical Reasoning (Post-Note)", f"{agg.get('post_note_score', 0)}/10", "Pass" if agg.get('post_note_score', 0) >= 6 else "Fail"],
        ["Overall Result", "", "PASS" if agg.get('passed', False) else "FAIL"]
    ]
    
    score_table = Table(score_data, colWidths=[3*inch, 1.5*inch, 1.2*inch])
    score_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#CC0033")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 10),
        ("ALIGN", (1,0), (-1,-1), "CENTER"),
        ("BACKGROUND", (0,4), (-1,4), colors.HexColor("#f0f0f0")),
        ("FONTNAME", (0,4), (-1,4), "Helvetica-Bold"),
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("TOPPADDING", (0,0), (-1,-1), 8),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Feedback Summary
    story.append(Paragraph("Summary Feedback", h2))
    story.append(Paragraph(data.get("feedback_summary", "No feedback available."), body))
    story.append(Spacer(1, 0.2*inch))
    
    # Critical Actions
    rubric = data.get("rubric_evaluation", {})
    checklist = rubric.get("critical_action_checklist", [])
    if checklist:
        story.append(Paragraph("Critical Action Checklist", h2))
        for item in checklist:
            status = "✓" if item.get("met") else "✗"
            color = "green" if item.get("met") else "red"
            criterion = item.get('criterion', '')[:100]
            story.append(Paragraph(f"<font color='{color}'>{status}</font> <b>{criterion}</b>", body))
            if item.get("evidence"):
                evidence = item.get('evidence', '')[:200]
                story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;<i>Evidence: {evidence}</i>", body))
        story.append(Spacer(1, 0.2*inch))
    
    # Communication Scores
    comm = rubric.get("empathy_clarity_scale", {})
    if comm:
        story.append(Paragraph("Communication & Empathy Assessment", h2))
        comm_data = [["Domain", "Score", "Comment"]]
        for key, val in comm.items():
            comm_data.append([key.replace("_", " ").title(), f"{val.get('score', 0)}/5", val.get('comment', '')])
        
        comm_table = Table(comm_data, colWidths=[1.8*inch, 0.7*inch, 4*inch])
        comm_table.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#333333")),
            ("TEXTCOLOR", (0,0), (-1,0), colors.white),
            ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
            ("FONTSIZE", (0,0), (-1,-1), 9),
            ("ALIGN", (1,0), (1,-1), "CENTER"),
            ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("BOTTOMPADDING", (0,0), (-1,-1), 8),
            ("TOPPADDING", (0,0), (-1,-1), 8),
            ("WORDWRAP", (0,0), (-1,-1), True),
        ]))
        story.append(comm_table)
        story.append(Spacer(1, 0.2*inch))
    
    # Clinical Reasoning
    clin = rubric.get("clinical_reasoning", {})
    if clin:
        story.append(Paragraph("Clinical Reasoning (Post-Note)", h2))
        clin_data = [
            ["Component", "Score"],
            ["Epidemiology & Patient Profile", f"{clin.get('epidemiology_profile', 0)}/2"],
            ["Prioritized Problem Cues", f"{clin.get('prioritized_problem_cues', 0)}/2"],
            ["Problem Statement", f"{clin.get('problem_statement', 0)}/2"],
            ["Differential Diagnosis", f"{clin.get('differential_diagnosis', 0)}/2"],
            ["Diagnostic Plan", f"{clin.get('diagnostic_plan', 0)}/2"],
            ["Total", f"{clin.get('total_score', 0)}/10"]
        ]
        
        clin_table = Table(clin_data, colWidths=[4*inch, 1.5*inch])
        clin_table.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#333333")),
            ("TEXTCOLOR", (0,0), (-1,0), colors.white),
            ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
            ("BACKGROUND", (0,-1), (-1,-1), colors.HexColor("#f0f0f0")),
            ("FONTNAME", (0,-1), (-1,-1), "Helvetica-Bold"),
            ("FONTSIZE", (0,0), (-1,-1), 10),
            ("ALIGN", (1,0), (1,-1), "CENTER"),
            ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
            ("BOTTOMPADDING", (0,0), (-1,-1), 6),
            ("TOPPADDING", (0,0), (-1,-1), 6),
        ]))
        story.append(clin_table)
    
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    
    input_json = Path(sys.argv[1])
    output_pdf = Path(sys.argv[2])
    title = sys.argv[3] if len(sys.argv) > 3 else "OSCE Evaluation Report"
    
    build_pdf(input_json, output_pdf, title)
    print(str(output_pdf))
