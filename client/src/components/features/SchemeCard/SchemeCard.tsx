import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { useNavigate } from 'react-router-dom';

interface SchemeCardProps {
  scheme: {
    _id: string;
    name: { en: string; hi: string; mr: string; ta: string };
    ministry: string;
    benefits?: {
      financial?: { amount: number; unit: string };
      description?: string;
    };
    applicationDeadline?: string;
    status: string;
  };
  language?: 'en' | 'hi' | 'mr' | 'ta';
}

export const SchemeCard = ({ scheme, language = 'en' }: SchemeCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isDeadlineApproaching = () => {
    if (!scheme.applicationDeadline) return false;
    const deadline = new Date(scheme.applicationDeadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {scheme.name[language] || scheme.name.en}
            </h3>
            {scheme.status === 'active' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                Active
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-3">{scheme.ministry}</p>

          {scheme.benefits?.financial && (
            <div className="mb-3 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-600 font-medium">Financial Benefit</p>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(scheme.benefits.financial.amount)}
                {scheme.benefits.financial.unit && (
                  <span className="text-sm font-normal text-gray-600">
                    /{scheme.benefits.financial.unit}
                  </span>
                )}
              </p>
            </div>
          )}

          {scheme.applicationDeadline && (
            <div className={`text-sm mb-3 ${isDeadlineApproaching() ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
              {isDeadlineApproaching() && '⚠️ '}
              Deadline: {new Date(scheme.applicationDeadline).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/schemes/${scheme._id}`)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/eligibility?scheme=${scheme._id}`)}
            className="flex-1"
          >
            Check Eligibility
          </Button>
        </div>
      </div>
    </Card>
  );
};