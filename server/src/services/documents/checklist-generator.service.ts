import { EligibilityRule } from '@models/EligibilityRule.model.js';
 
interface ChecklistItem {
  document: string;
  required: boolean;
  description: string;
  category: 'identity' | 'landOwnership' | 'income' | 'category' | 'other';
}

export const checklistGeneratorService = {
  async generateDocumentChecklist(schemeId: string, _farmerProfile: any): Promise<ChecklistItem[]> {
    const checklist: ChecklistItem[] = [];

    checklist.push({
      document: 'Aadhaar Card',
      required: true,
      description: 'Government-issued identity proof',
      category: 'identity',
    });

    checklist.push({
      document: 'Bank Account Details',
      required: true,
      description: 'Passbook copy or cancelled cheque',
      category: 'identity',
    });

    const rule = await EligibilityRule.findOne({ schemeId });

    if (rule) {
      if (rule.rules.some((r: any) => r.field === 'landholding')) {
        checklist.push({
          document: 'Land Records (7/12 Extract)',
          required: true,
          description: 'Latest land ownership documents',
          category: 'landOwnership',
        });
      }

      if (rule.rules.some((r: any) => r.field === 'socialCategory')) {
        checklist.push({
          document: 'Caste Certificate',
          required: true,
          description: 'Valid caste certificate if applying under reserved category',
          category: 'category',
        });
      }

      if (rule.rules.some((r: any) => r.field === 'income')) {
        checklist.push({
          document: 'Income Certificate',
          required: true,
          description: 'Certificate from revenue authorities',
          category: 'income',
        });
      }
    }

    checklist.push({
      document: 'Recent Photograph',
      required: true,
      description: 'Passport-size photograph',
      category: 'identity',
    });

    return checklist;
  },

  formatChecklistAsHTML(checklist: ChecklistItem[]): string {
    const groupedByCategory = checklist.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ChecklistItem[]>);

    let html = '<html><head><style>body{font-family:Arial;padding:20px;}h2{color:#2c5f2d;}ul{list-style:none;}.required{color:red;}</style></head><body>';
    html += '<h1>Document Checklist</h1>';

    for (const [category, items] of Object.entries(groupedByCategory)) {
      html += `<h2>${category.replace(/([A-Z])/g, ' $1').trim()}</h2>`;
      html += '<ul>';

      for (const item of items) {
        const requiredTag = item.required ? '<span class="required">*</span>' : '';
        html += `<li>☐ <strong>${item.document}</strong> ${requiredTag}<br><small>${item.description}</small></li>`;
      }

      html += '</ul>';
    }

    html += '</body></html>';
    return html;
  },
};